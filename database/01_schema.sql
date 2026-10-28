BEGIN;

CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS agronomy;


CREATE TABLE agronomy.data_source (
    source_id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    source_code      VARCHAR(40)  NOT NULL UNIQUE,
    title            VARCHAR(300) NOT NULL,
    publisher        VARCHAR(200),
    publication_year SMALLINT CHECK (publication_year BETWEEN 1900 AND 2100),
    url              TEXT,
    notes            TEXT
);

CREATE TABLE agronomy.agroclimatic_zone (
    zone_id      SMALLINT     PRIMARY KEY CHECK (zone_id BETWEEN 1 AND 99),
    zone_code    VARCHAR(20)  NOT NULL UNIQUE,
    short_code   VARCHAR(5)   NOT NULL UNIQUE,
    zone_name    VARCHAR(150) NOT NULL,
    description  TEXT,
    is_official  BOOLEAN NOT NULL DEFAULT FALSE,
    active       BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE agronomy.soil_type (
    soil_id              SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    soil_code            VARCHAR(20)  NOT NULL UNIQUE,
    soil_name_sq         VARCHAR(100) NOT NULL,
    field_capacity_mm_m  NUMERIC(6,1) NOT NULL,
    wilting_point_mm_m   NUMERIC(6,1) NOT NULL,
    taw_mm_m             NUMERIC(6,1) GENERATED ALWAYS AS
                             (field_capacity_mm_m - wilting_point_mm_m) STORED,
    source_id            BIGINT REFERENCES agronomy.data_source(source_id),
    CHECK (wilting_point_mm_m >= 0 AND field_capacity_mm_m > wilting_point_mm_m)
);

CREATE TABLE core.water_source_type (
    source_type_code VARCHAR(20)  PRIMARY KEY,
    name_sq          VARCHAR(100) NOT NULL,
    name_en          VARCHAR(100)
);

CREATE TABLE agronomy.irrigation_method (
    method_code        VARCHAR(20)  PRIMARY KEY,
    name_sq            VARCHAR(100) NOT NULL,
    name_en            VARCHAR(100),
    efficiency_min     NUMERIC(4,3) NOT NULL,
    efficiency_max     NUMERIC(4,3) NOT NULL,
    efficiency_default NUMERIC(4,3) NOT NULL,
    CHECK (efficiency_min > 0 AND efficiency_max <= 1),
    CHECK (efficiency_min <= efficiency_default AND efficiency_default <= efficiency_max)
);


CREATE TABLE core.county (
    county_id SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name      VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE core.municipality (
    municipality_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    county_id       SMALLINT    NOT NULL REFERENCES core.county(county_id),
    name            VARCHAR(80) NOT NULL,
    UNIQUE (county_id, name)
);

CREATE TABLE agronomy.climate_station (
    station_id    INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    station_code  VARCHAR(30)  NOT NULL UNIQUE,
    station_name  VARCHAR(150) NOT NULL,
    zone_id       SMALLINT REFERENCES agronomy.agroclimatic_zone(zone_id),
    latitude      NUMERIC(9,6) CHECK (latitude  BETWEEN -90  AND 90),
    longitude     NUMERIC(9,6) CHECK (longitude BETWEEN -180 AND 180),
    elevation_m   NUMERIC(7,1),
    source_id     BIGINT REFERENCES agronomy.data_source(source_id),
    active        BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE core.admin_unit (
    admin_unit_id      INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    municipality_id    INTEGER     NOT NULL REFERENCES core.municipality(municipality_id),
    name               VARCHAR(80) NOT NULL,
    zone_id            SMALLINT    NOT NULL REFERENCES agronomy.agroclimatic_zone(zone_id),
    default_soil_id    SMALLINT    REFERENCES agronomy.soil_type(soil_id),
    climate_station_id INTEGER     REFERENCES agronomy.climate_station(station_id),
    UNIQUE (municipality_id, name)
);

CREATE TABLE core.irrigation_scheme (
    scheme_id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    municipality_id       INTEGER      NOT NULL REFERENCES core.municipality(municipality_id),
    scheme_code           VARCHAR(30)  NOT NULL,
    scheme_name           VARCHAR(200) NOT NULL,
    source_type_code      VARCHAR(20)  REFERENCES core.water_source_type(source_type_code),
    source_name           VARCHAR(200),
    transfer_type         VARCHAR(20)  CHECK (transfer_type IN ('PLOTE', 'PJESERISHT')),
    canal_km              NUMERIC(10,2) CHECK (canal_km >= 0),
    design_flow_ls        NUMERIC(12,2) CHECK (design_flow_ls > 0),
    max_supply_hours_day  NUMERIC(4,1)  CHECK (max_supply_hours_day > 0 AND max_supply_hours_day <= 24),
    conveyance_efficiency NUMERIC(4,3)  CHECK (conveyance_efficiency > 0 AND conveyance_efficiency <= 1),
    active                BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (municipality_id, scheme_code)
);


CREATE TABLE agronomy.crop_group (
    crop_group_id SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name_sq       VARCHAR(60) NOT NULL UNIQUE,
    name_en       VARCHAR(60)
);

CREATE TABLE agronomy.crop_catalog (
    crop_id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    crop_code          VARCHAR(20)  NOT NULL UNIQUE,
    crop_name_sq       VARCHAR(150) NOT NULL,
    crop_name_en       VARCHAR(150),
    crop_group_id      SMALLINT     REFERENCES agronomy.crop_group(crop_group_id),
    crop_type          VARCHAR(30),
    cultivation_system VARCHAR(30),
    is_perennial       BOOLEAN NOT NULL DEFAULT FALSE,
    active             BOOLEAN NOT NULL DEFAULT TRUE,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_crop_code CHECK (crop_code ~ '^AL-CROP-[0-9]{6}$')
);

CREATE TABLE agronomy.crop_zone_parameters (
    parameter_id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    crop_id              BIGINT   NOT NULL REFERENCES agronomy.crop_catalog(crop_id),
    zone_id              SMALLINT NOT NULL REFERENCES agronomy.agroclimatic_zone(zone_id),
    is_applicable        BOOLEAN  NOT NULL DEFAULT TRUE,

    cycle_duration_days  INTEGER      CHECK (cycle_duration_days > 0),
    planting_start_month SMALLINT     CHECK (planting_start_month BETWEEN 1 AND 12),
    planting_end_month   SMALLINT     CHECK (planting_end_month   BETWEEN 1 AND 12),
    root_depth_m         NUMERIC(5,2) CHECK (root_depth_m > 0),
    depletion_fraction_p NUMERIC(4,3) CHECK (depletion_fraction_p BETWEEN 0 AND 1),

    validation_status    VARCHAR(30)  NOT NULL DEFAULT 'THEORETICAL'
        CHECK (validation_status IN ('THEORETICAL', 'MUNICIPALITY_REVIEWED',
                                     'AGRONOMICALLY_VALIDATED', 'INSTITUTIONALLY_APPROVED')),
    source_id            BIGINT REFERENCES agronomy.data_source(source_id),
    valid_from           DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_to             DATE,
    approved_by          VARCHAR(150),
    notes                TEXT,

    CHECK (valid_to IS NULL OR valid_to >= valid_from),
    CONSTRAINT excl_crop_zone_validity EXCLUDE USING gist (
        crop_id WITH =, zone_id WITH =,
        daterange(valid_from, valid_to, '[]') WITH &&)
);

CREATE TABLE agronomy.crop_phenology_phase (
    phase_id      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    parameter_id  BIGINT NOT NULL
        REFERENCES agronomy.crop_zone_parameters(parameter_id) ON DELETE CASCADE,
    phase_no      SMALLINT     NOT NULL CHECK (phase_no BETWEEN 1 AND 12),
    phase_name    VARCHAR(100) NOT NULL,
    fao_stage     VARCHAR(12)  NOT NULL
        CHECK (fao_stage IN ('INITIAL', 'DEVELOPMENT', 'MID', 'LATE')),
    duration_days NUMERIC(6,2) NOT NULL CHECK (duration_days > 0),
    source_id     BIGINT REFERENCES agronomy.data_source(source_id),
    notes         TEXT,
    UNIQUE (parameter_id, phase_no)
);

CREATE TABLE agronomy.crop_kc_parameters (
    kc_id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    parameter_id     BIGINT NOT NULL UNIQUE
        REFERENCES agronomy.crop_zone_parameters(parameter_id) ON DELETE CASCADE,
    kc_initial       NUMERIC(5,3) CHECK (kc_initial BETWEEN 0 AND 2),
    kc_mid           NUMERIC(5,3) CHECK (kc_mid     BETWEEN 0 AND 2),
    kc_end           NUMERIC(5,3) CHECK (kc_end     BETWEEN 0 AND 2),
    kc_method        VARCHAR(20)
        CHECK (kc_method IN ('FAO56_TABLE', 'FAO56_ADJUSTED', 'LOCAL')),
    source_id        BIGINT REFERENCES agronomy.data_source(source_id),
    source_reference TEXT,
    notes            TEXT
);

CREATE TABLE agronomy.crop_zone_monthly_need (
    crop_id           BIGINT   NOT NULL REFERENCES agronomy.crop_catalog(crop_id),
    zone_id           SMALLINT NOT NULL REFERENCES agronomy.agroclimatic_zone(zone_id),
    month             SMALLINT NOT NULL CHECK (month BETWEEN 1 AND 12),
    net_need_mm       NUMERIC(6,1) NOT NULL CHECK (net_need_mm >= 0),
    validation_status VARCHAR(30)  NOT NULL DEFAULT 'THEORETICAL'
        CHECK (validation_status IN ('THEORETICAL', 'MUNICIPALITY_REVIEWED',
                                     'AGRONOMICALLY_VALIDATED', 'INSTITUTIONALLY_APPROVED')),
    source_id         BIGINT REFERENCES agronomy.data_source(source_id),
    PRIMARY KEY (crop_id, zone_id, month)
);


CREATE TABLE agronomy.climate_daily_data (
    station_id  INTEGER NOT NULL REFERENCES agronomy.climate_station(station_id),
    obs_date    DATE    NOT NULL,
    et0_mm      NUMERIC(6,2) CHECK (et0_mm  >= 0),
    rain_mm     NUMERIC(7,2) CHECK (rain_mm >= 0),
    is_forecast BOOLEAN NOT NULL DEFAULT FALSE,
    source_id   BIGINT REFERENCES agronomy.data_source(source_id),
    PRIMARY KEY (station_id, obs_date)
);

CREATE TABLE agronomy.climate_monthly_data (
    zone_id           SMALLINT    NOT NULL REFERENCES agronomy.agroclimatic_zone(zone_id),
    month             SMALLINT    NOT NULL CHECK (month BETWEEN 1 AND 12),
    ref_period        VARCHAR(20) NOT NULL,
    et0_mm_day        NUMERIC(5,2) CHECK (et0_mm_day >= 0),
    rain_mm           NUMERIC(6,1) CHECK (rain_mm >= 0),
    effective_rain_mm NUMERIC(6,1) CHECK (effective_rain_mm >= 0),
    effective_rain_method VARCHAR(20)
        CHECK (effective_rain_method IN ('USDA_SCS', 'FAO_DEPENDABLE', 'FIXED_PCT')),
    source_id         BIGINT REFERENCES agronomy.data_source(source_id),
    PRIMARY KEY (zone_id, month, ref_period),
    CHECK (effective_rain_mm IS NULL OR rain_mm IS NULL OR effective_rain_mm <= rain_mm)
);


CREATE TABLE agronomy.request_status (
    status_code VARCHAR(20) PRIMARY KEY,
    name_sq     VARCHAR(60) NOT NULL,
    sort_order  SMALLINT    NOT NULL,
    is_decision BOOLEAN     NOT NULL DEFAULT FALSE
);

CREATE TABLE agronomy.request_status_transition (
    from_status   VARCHAR(20) NOT NULL REFERENCES agronomy.request_status(status_code),
    to_status     VARCHAR(20) NOT NULL REFERENCES agronomy.request_status(status_code),
    note_required BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (from_status, to_status)
);

CREATE TABLE agronomy.municipal_crop_plan (
    plan_id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    request_no             VARCHAR(20) NOT NULL UNIQUE
        CHECK (request_no ~ '^K-[0-9]{4}-[0-9]{4,}$'),
    season_year            SMALLINT NOT NULL CHECK (season_year BETWEEN 2000 AND 2100),

    admin_unit_id          INTEGER  NOT NULL REFERENCES core.admin_unit(admin_unit_id),
    village                VARCHAR(120),
    scheme_id              BIGINT   REFERENCES core.irrigation_scheme(scheme_id),
    parcel_code            VARCHAR(40),
    farmer_ref             VARCHAR(200),

    crop_id                BIGINT   REFERENCES agronomy.crop_catalog(crop_id),
    parcel_area_ha         NUMERIC(12,4) CHECK (parcel_area_ha > 0),
    cultivated_area_ha     NUMERIC(12,4) CHECK (cultivated_area_ha > 0),
    irrigated_area_ha      NUMERIC(12,4) CHECK (irrigated_area_ha > 0),
    planting_date          DATE,
    expected_harvest_date  DATE,
    irrigation_method_code VARCHAR(20)  REFERENCES agronomy.irrigation_method(method_code),
    source_type_code       VARCHAR(20)  REFERENCES core.water_source_type(source_type_code),
    application_efficiency NUMERIC(4,3) CHECK (application_efficiency > 0 AND application_efficiency <= 1),
    soil_id                SMALLINT     REFERENCES agronomy.soil_type(soil_id),

    status                 VARCHAR(20) NOT NULL DEFAULT 'DRAFT'
        REFERENCES agronomy.request_status(status_code),
    approved_volume_m3     NUMERIC(14,1) CHECK (approved_volume_m3 >= 0),
    status_note            TEXT,

    created_by             VARCHAR(150),
    created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    submitted_at           TIMESTAMPTZ,
    decided_at             TIMESTAMPTZ,

    CHECK (cultivated_area_ha IS NULL OR parcel_area_ha IS NULL
           OR cultivated_area_ha <= parcel_area_ha),
    CHECK (irrigated_area_ha IS NULL OR cultivated_area_ha IS NULL
           OR irrigated_area_ha <= cultivated_area_ha),
    CHECK (planting_date IS NULL
           OR planting_date BETWEEN make_date(season_year - 1, 10, 1)
                                AND make_date(season_year, 9, 30)),
    CHECK (expected_harvest_date IS NULL OR planting_date IS NULL
           OR expected_harvest_date >= planting_date),
    CHECK (status <> 'PJESERISHT' OR coalesce(approved_volume_m3, 0) > 0)
);

CREATE UNIQUE INDEX ux_plan_parcel_crop_year
    ON agronomy.municipal_crop_plan (upper(btrim(parcel_code)), season_year, crop_id)
    WHERE status <> 'REFUZUAR' AND parcel_code IS NOT NULL AND crop_id IS NOT NULL;

CREATE INDEX idx_plan_admin_unit_year ON agronomy.municipal_crop_plan (admin_unit_id, season_year);
CREATE INDEX idx_plan_scheme_year     ON agronomy.municipal_crop_plan (scheme_id, season_year);
CREATE INDEX idx_plan_status          ON agronomy.municipal_crop_plan (status);

CREATE TABLE agronomy.plan_status_history (
    history_id  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    plan_id     BIGINT NOT NULL
        REFERENCES agronomy.municipal_crop_plan(plan_id) ON DELETE CASCADE,
    from_status VARCHAR(20) REFERENCES agronomy.request_status(status_code),
    to_status   VARCHAR(20) NOT NULL REFERENCES agronomy.request_status(status_code),
    note        TEXT,
    changed_by  VARCHAR(150),
    changed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_status_history_plan ON agronomy.plan_status_history (plan_id, changed_at);


CREATE TABLE agronomy.demand_calculation_run (
    run_id                 BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    plan_id                BIGINT NOT NULL
        REFERENCES agronomy.municipal_crop_plan(plan_id) ON DELETE CASCADE,
    calc_method            VARCHAR(10) NOT NULL CHECK (calc_method IN ('MATRIX', 'FAO56')),
    calculation_version    VARCHAR(30) NOT NULL,
    zone_id                SMALLINT NOT NULL REFERENCES agronomy.agroclimatic_zone(zone_id),
    parameter_id           BIGINT   REFERENCES agronomy.crop_zone_parameters(parameter_id),
    irrigated_area_ha      NUMERIC(12,4) NOT NULL CHECK (irrigated_area_ha > 0),
    application_efficiency NUMERIC(4,3)  NOT NULL
        CHECK (application_efficiency > 0 AND application_efficiency <= 1),
    total_net_mm           NUMERIC(10,2) CHECK (total_net_mm >= 0),
    total_volume_net_m3    NUMERIC(16,1) CHECK (total_volume_net_m3 >= 0),
    total_volume_gross_m3  NUMERIC(16,1) CHECK (total_volume_gross_m3 >= 0),
    is_current             BOOLEAN NOT NULL DEFAULT TRUE,
    calculated_by          VARCHAR(150),
    calculated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (calc_method <> 'FAO56' OR parameter_id IS NOT NULL)
);
CREATE UNIQUE INDEX ux_run_current_per_plan
    ON agronomy.demand_calculation_run (plan_id) WHERE is_current;

CREATE TABLE agronomy.irrigation_demand_result (
    result_id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    run_id                     BIGINT NOT NULL
        REFERENCES agronomy.demand_calculation_run(run_id) ON DELETE CASCADE,
    period_type                VARCHAR(5) NOT NULL CHECK (period_type IN ('DAY', 'MONTH')),
    period_start               DATE NOT NULL,
    period_end                 DATE NOT NULL,

    crop_phase_no              SMALLINT,
    kc_value                   NUMERIC(7,4) CHECK (kc_value >= 0),
    et0_mm                     NUMERIC(10,3) CHECK (et0_mm >= 0),
    etc_mm                     NUMERIC(10,3) CHECK (etc_mm >= 0),
    effective_rain_mm          NUMERIC(10,3) CHECK (effective_rain_mm >= 0),
    soil_moisture_start_mm     NUMERIC(10,3),
    soil_moisture_end_mm       NUMERIC(10,3),
    soil_water_contribution_mm NUMERIC(10,3),
    net_need_mm                NUMERIC(10,3) NOT NULL CHECK (net_need_mm >= 0),
    gross_need_mm              NUMERIC(10,3) NOT NULL CHECK (gross_need_mm >= 0),
    volume_net_m3              NUMERIC(16,3) NOT NULL CHECK (volume_net_m3 >= 0),
    volume_gross_m3            NUMERIC(16,3) NOT NULL CHECK (volume_gross_m3 >= 0),
    et0_source_id              BIGINT REFERENCES agronomy.data_source(source_id),
    kc_source_id               BIGINT REFERENCES agronomy.data_source(source_id),

    UNIQUE (run_id, period_type, period_start),
    CHECK (period_end >= period_start),
    CHECK (period_type <> 'DAY' OR period_end = period_start),
    CHECK (gross_need_mm >= net_need_mm),
    CHECK (volume_gross_m3 >= volume_net_m3)
);


CREATE TABLE agronomy.agronomic_validation_log (
    log_id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    table_name    VARCHAR(63) NOT NULL,
    record_key    JSONB       NOT NULL,
    action        VARCHAR(6)  NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_value     JSONB,
    new_value     JSONB,
    change_reason TEXT,
    changed_by    VARCHAR(150) NOT NULL,
    changed_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_validation_log_table ON agronomy.agronomic_validation_log (table_name, changed_at);


CREATE FUNCTION agronomy.trg_plan_validate() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
    m             agronomy.irrigation_method%ROWTYPE;
    perennial     BOOLEAN;
    need_note     BOOLEAN;
    gross_total   NUMERIC;
BEGIN
    NEW.updated_at := NOW();

    IF NEW.application_efficiency IS NOT NULL AND NEW.irrigation_method_code IS NOT NULL THEN
        SELECT * INTO m FROM agronomy.irrigation_method WHERE method_code = NEW.irrigation_method_code;
        IF NEW.application_efficiency NOT BETWEEN m.efficiency_min AND m.efficiency_max THEN
            RAISE EXCEPTION 'Efikasiteti % jashtë intervalit % – % për metodën %',
                NEW.application_efficiency, m.efficiency_min, m.efficiency_max, m.method_code;
        END IF;
    END IF;

    IF TG_OP = 'INSERT' AND NEW.status <> 'DRAFT' THEN
        RAISE EXCEPTION 'Kërkesa e re fillon si DRAFT';
    END IF;

    IF TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status THEN
        SELECT note_required INTO need_note
          FROM agronomy.request_status_transition
         WHERE from_status = OLD.status AND to_status = NEW.status;
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Kalimi % → % nuk lejohet', OLD.status, NEW.status;
        END IF;
        IF need_note AND btrim(coalesce(NEW.status_note, '')) = '' THEN
            RAISE EXCEPTION 'Kalimi në % kërkon arsyen (status_note)', NEW.status;
        END IF;

        IF NEW.status = 'DOREZUAR' THEN NEW.submitted_at := NOW(); END IF;
        IF NEW.status IN ('PRANUAR', 'PJESERISHT', 'REFUZUAR') THEN NEW.decided_at := NOW(); END IF;
        IF NEW.status = 'DRAFT' THEN NEW.submitted_at := NULL; NEW.decided_at := NULL; END IF;

        IF NEW.status = 'PJESERISHT' THEN
            SELECT total_volume_gross_m3 INTO gross_total
              FROM agronomy.demand_calculation_run
             WHERE plan_id = NEW.plan_id AND is_current;
            IF gross_total IS NOT NULL AND NEW.approved_volume_m3 >= gross_total THEN
                RAISE EXCEPTION 'Volumi i pranuar (%) duhet të jetë më i vogël se volumi bruto (%)',
                    NEW.approved_volume_m3, gross_total;
            END IF;
        END IF;
    END IF;

    IF NEW.status <> 'DRAFT' THEN
        IF NEW.parcel_code IS NULL OR NEW.farmer_ref IS NULL OR NEW.crop_id IS NULL
           OR NEW.parcel_area_ha IS NULL OR NEW.cultivated_area_ha IS NULL
           OR NEW.irrigated_area_ha IS NULL OR NEW.irrigation_method_code IS NULL
           OR NEW.source_type_code IS NULL OR NEW.application_efficiency IS NULL THEN
            RAISE EXCEPTION 'Kërkesa % nuk mund të kalojë në % pa plotësuar fushat e detyrueshme',
                NEW.request_no, NEW.status;
        END IF;
        SELECT is_perennial INTO perennial FROM agronomy.crop_catalog WHERE crop_id = NEW.crop_id;
        IF NOT perennial AND NEW.planting_date IS NULL THEN
            RAISE EXCEPTION 'Data e mbjelljes kërkohet për kulturat njëvjeçare';
        END IF;
    END IF;

    RETURN NEW;
END $$;

CREATE TRIGGER plan_validate
    BEFORE INSERT OR UPDATE ON agronomy.municipal_crop_plan
    FOR EACH ROW EXECUTE FUNCTION agronomy.trg_plan_validate();

CREATE FUNCTION agronomy.trg_plan_history() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
    IF TG_OP = 'INSERT' OR NEW.status IS DISTINCT FROM OLD.status THEN
        INSERT INTO agronomy.plan_status_history (plan_id, from_status, to_status, note, changed_by)
        VALUES (NEW.plan_id,
                CASE WHEN TG_OP = 'UPDATE' THEN OLD.status END,
                NEW.status, NEW.status_note,
                coalesce(nullif(current_setting('idmis.user', true), ''), current_user));
    END IF;
    RETURN NULL;
END $$;

CREATE TRIGGER plan_history
    AFTER INSERT OR UPDATE OF status ON agronomy.municipal_crop_plan
    FOR EACH ROW EXECUTE FUNCTION agronomy.trg_plan_history();

CREATE FUNCTION agronomy.trg_validation_log() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
    key_cols TEXT[] := TG_ARGV;
    src      JSONB  := to_jsonb(CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END);
    rec_key  JSONB  := '{}';
    c        TEXT;
BEGIN
    FOREACH c IN ARRAY key_cols LOOP
        rec_key := rec_key || jsonb_build_object(c, src -> c);
    END LOOP;
    INSERT INTO agronomy.agronomic_validation_log
        (table_name, record_key, action, old_value, new_value, change_reason, changed_by)
    VALUES (TG_TABLE_NAME, rec_key, TG_OP,
            CASE WHEN TG_OP <> 'INSERT' THEN to_jsonb(OLD) END,
            CASE WHEN TG_OP <> 'DELETE' THEN to_jsonb(NEW) END,
            nullif(current_setting('idmis.change_reason', true), ''),
            coalesce(nullif(current_setting('idmis.user', true), ''), current_user));
    RETURN NULL;
END $$;

CREATE TRIGGER log_crop_zone_parameters
    AFTER INSERT OR UPDATE OR DELETE ON agronomy.crop_zone_parameters
    FOR EACH ROW EXECUTE FUNCTION agronomy.trg_validation_log('parameter_id');
CREATE TRIGGER log_crop_phenology_phase
    AFTER INSERT OR UPDATE OR DELETE ON agronomy.crop_phenology_phase
    FOR EACH ROW EXECUTE FUNCTION agronomy.trg_validation_log('phase_id');
CREATE TRIGGER log_crop_kc_parameters
    AFTER INSERT OR UPDATE OR DELETE ON agronomy.crop_kc_parameters
    FOR EACH ROW EXECUTE FUNCTION agronomy.trg_validation_log('kc_id');
CREATE TRIGGER log_crop_zone_monthly_need
    AFTER INSERT OR UPDATE OR DELETE ON agronomy.crop_zone_monthly_need
    FOR EACH ROW EXECUTE FUNCTION agronomy.trg_validation_log('crop_id', 'zone_id', 'month');
CREATE TRIGGER log_climate_monthly_data
    AFTER INSERT OR UPDATE OR DELETE ON agronomy.climate_monthly_data
    FOR EACH ROW EXECUTE FUNCTION agronomy.trg_validation_log('zone_id', 'month', 'ref_period');


CREATE VIEW agronomy.v_crop_phase_calendar AS
SELECT p.parameter_id, z.crop_id, z.zone_id, p.phase_no, p.phase_name, p.fao_stage,
       p.duration_days,
       coalesce(sum(p.duration_days) OVER w_before, 0) + 1 AS start_day,
       sum(p.duration_days) OVER w_upto                     AS end_day
  FROM agronomy.crop_phenology_phase p
  JOIN agronomy.crop_zone_parameters z USING (parameter_id)
WINDOW w_before AS (PARTITION BY p.parameter_id ORDER BY p.phase_no
                    ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING),
       w_upto   AS (PARTITION BY p.parameter_id ORDER BY p.phase_no);

CREATE VIEW agronomy.v_phase_duration_check AS
SELECT z.parameter_id, c.crop_code, c.crop_name_sq, az.zone_code,
       z.cycle_duration_days, sum(p.duration_days) AS phases_total_days
  FROM agronomy.crop_zone_parameters z
  JOIN agronomy.crop_catalog c       USING (crop_id)
  JOIN agronomy.agroclimatic_zone az USING (zone_id)
  JOIN agronomy.crop_phenology_phase p USING (parameter_id)
 GROUP BY z.parameter_id, c.crop_code, c.crop_name_sq, az.zone_code, z.cycle_duration_days
HAVING z.cycle_duration_days IS DISTINCT FROM sum(p.duration_days);

CREATE VIEW agronomy.v_scheme_monthly_demand AS
WITH monthly AS (
    SELECT p.scheme_id, p.season_year,
           date_trunc('month', r.period_start)::date AS month_start,
           count(DISTINCT p.plan_id)                  AS requests,
           sum(r.volume_gross_m3)                     AS volume_gross_m3
      FROM agronomy.municipal_crop_plan p
      JOIN agronomy.demand_calculation_run run ON run.plan_id = p.plan_id AND run.is_current
      JOIN agronomy.irrigation_demand_result r ON r.run_id = run.run_id
     WHERE p.scheme_id IS NOT NULL
       AND p.status NOT IN ('DRAFT', 'REFUZUAR')
     GROUP BY p.scheme_id, p.season_year, date_trunc('month', r.period_start)
), calc AS (
    SELECT m.*, s.scheme_code, s.scheme_name, s.design_flow_ls,
           s.conveyance_efficiency IS NOT NULL AS conveyance_known,
           m.volume_gross_m3 / coalesce(s.conveyance_efficiency, 1) AS volume_source,
           extract(day FROM m.month_start + interval '1 month - 1 day') AS days,
           coalesce(s.max_supply_hours_day, 24)                         AS hours
      FROM monthly m
      JOIN core.irrigation_scheme s USING (scheme_id)
)
SELECT scheme_id, scheme_code, scheme_name, season_year, month_start, requests,
       round(volume_gross_m3, 1)                                  AS volume_gross_m3,
       round(volume_source, 1)                                    AS volume_at_source_m3,
       conveyance_known,
       round(volume_source * 1000 / (days * hours * 3600), 2)     AS required_flow_ls,
       design_flow_ls,
       round(design_flow_ls * 3.6 * hours * days, 1)              AS capacity_m3,
       volume_source > design_flow_ls * 3.6 * hours * days        AS is_deficit
  FROM calc;


INSERT INTO agronomy.agroclimatic_zone (zone_id, zone_code, short_code, zone_name, description) VALUES
    (1, 'ZONE_1', 'Z1', 'Bregdetare dhe Ultësira Perëndimore', 'Zonë pune paraprake; kërkon verifikim agroklimatik'),
    (2, 'ZONE_2', 'Z2', 'Qendrore dhe kodrinore',              'Zonë pune paraprake; kërkon verifikim agroklimatik'),
    (3, 'ZONE_3', 'Z3', 'Jugore dhe jugperëndimore',           'Zonë pune paraprake; kërkon verifikim agroklimatik'),
    (4, 'ZONE_4', 'Z4', 'Verilindore dhe malore',              'Zonë pune paraprake; kërkon verifikim agroklimatik');

INSERT INTO core.water_source_type (source_type_code, name_sq, name_en) VALUES
    ('REZERVUAR', 'Rezervuar',               'Reservoir'),
    ('LUME',      'Lumë',                    'River'),
    ('KANAL',     'Kanal kryesor',           'Main canal'),
    ('PUS',       'Pus / burim nëntokësor',  'Well / groundwater'),
    ('TJETER',    'Tjetër',                  'Other');

INSERT INTO agronomy.irrigation_method
    (method_code, name_sq, name_en, efficiency_min, efficiency_max, efficiency_default) VALUES
    ('GRAVITET', 'Kanal i hapur / gravitet', 'Open canal / gravity', 0.40, 0.70, 0.55),
    ('SHI',      'Shi artificial',           'Sprinkler',            0.65, 0.85, 0.75),
    ('PIKE',     'Pikë-pikë',                'Drip',                 0.80, 0.95, 0.90),
    ('POMPIM',   'Pompim',                   'Pumping',              0.45, 0.75, 0.60);

INSERT INTO agronomy.crop_group (name_sq, name_en) VALUES
    ('Drithëra',             'Cereals'),
    ('Perime',               'Vegetables'),
    ('Foragjere',            'Forage'),
    ('Pemëtore dhe vreshta', 'Orchards and vineyards');

INSERT INTO agronomy.request_status (status_code, name_sq, sort_order, is_decision) VALUES
    ('DRAFT',      'Draft',       1, FALSE),
    ('DOREZUAR',   'Dorëzuar',    2, FALSE),
    ('VERIFIKUAR', 'Verifikuar',  3, FALSE),
    ('PRANUAR',    'Pranuar',     4, TRUE),
    ('PJESERISHT', 'Pjesërisht',  5, TRUE),
    ('REFUZUAR',   'Refuzuar',    6, TRUE);

INSERT INTO agronomy.request_status_transition (from_status, to_status, note_required) VALUES
    ('DRAFT',      'DOREZUAR',   FALSE),
    ('DOREZUAR',   'VERIFIKUAR', FALSE),
    ('DOREZUAR',   'PRANUAR',    FALSE),
    ('DOREZUAR',   'PJESERISHT', TRUE),
    ('DOREZUAR',   'REFUZUAR',   TRUE),
    ('DOREZUAR',   'DRAFT',      TRUE),
    ('VERIFIKUAR', 'PRANUAR',    FALSE),
    ('VERIFIKUAR', 'PJESERISHT', TRUE),
    ('VERIFIKUAR', 'REFUZUAR',   TRUE),
    ('PRANUAR',    'PJESERISHT', TRUE),
    ('PRANUAR',    'REFUZUAR',   TRUE),
    ('PJESERISHT', 'PRANUAR',    FALSE),
    ('PJESERISHT', 'REFUZUAR',   TRUE),
    ('REFUZUAR',   'PRANUAR',    FALSE),
    ('REFUZUAR',   'PJESERISHT', TRUE);

COMMIT;
