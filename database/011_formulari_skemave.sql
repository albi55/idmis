BEGIN;

CREATE TABLE skema_formulari (
    bashkia_id      INTEGER      NOT NULL,
    celesi          VARCHAR(200) NOT NULL,
    kodi            VARCHAR(60)  NOT NULL,
    emertimi        VARCHAR(200) NOT NULL,
    te_dhenat       JSONB        NOT NULL,
    perdoruesi_id   BIGINT       NOT NULL,
    perditesuar_me  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_skema_formulari PRIMARY KEY (bashkia_id, celesi),
    CONSTRAINT fk_sf_bashkia FOREIGN KEY (bashkia_id)
        REFERENCES bashkia (id) ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT fk_sf_perdoruesi FOREIGN KEY (perdoruesi_id)
        REFERENCES perdoruesi (id) ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT chk_sf_te_dhenat CHECK (jsonb_typeof(te_dhenat) = 'object')
);

COMMENT ON TABLE  skema_formulari                IS 'Formulari F01-03 "Inventari i Skemave" për çdo skemë ujitëse të bashkisë';
COMMENT ON COLUMN skema_formulari.celesi         IS 'Çelësi i rreshtit në faqe: "<kodi>|<emërtimi>" nga Excel-i ose "add-…"';
COMMENT ON COLUMN skema_formulari.te_dhenat      IS 'Fushat 2–24 të formularit dhe "statuset" (M/D/V/PZ/PZB për çdo fushë)';
COMMENT ON COLUMN skema_formulari.perditesuar_me IS 'Koha e ruajtjes së fundit që ndryshoi formularin';


CREATE TABLE skema_formulari_historiku (
    id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    bashkia_id     INTEGER      NOT NULL,
    celesi         VARCHAR(200) NOT NULL,
    para           JSONB,
    pas            JSONB        NOT NULL,
    perdoruesi_id  BIGINT       NOT NULL,
    ndryshuar_me   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_sfh_bashkia FOREIGN KEY (bashkia_id)
        REFERENCES bashkia (id) ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT fk_sfh_perdoruesi FOREIGN KEY (perdoruesi_id)
        REFERENCES perdoruesi (id) ON UPDATE RESTRICT ON DELETE RESTRICT
);

CREATE INDEX idx_sfh_skema ON skema_formulari_historiku (bashkia_id, celesi, ndryshuar_me);

COMMENT ON TABLE  skema_formulari_historiku      IS 'Historiku i formularëve F01-03: kush, kur, vlerat para dhe pas';
COMMENT ON COLUMN skema_formulari_historiku.para IS 'NULL = formulari u plotësua për herë të parë';

GRANT SELECT, INSERT, UPDATE ON skema_formulari           TO idmis_app;
GRANT SELECT, INSERT         ON skema_formulari_historiku TO idmis_app;

COMMIT;
