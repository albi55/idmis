BEGIN;

ALTER TABLE bashkia ADD COLUMN prefiksi CHAR(2);

UPDATE bashkia b SET prefiksi = v.prefiksi
  FROM (VALUES
    ('Belsh', 'BL'),
    ('Berat', 'BR'),
    ('Bulqizë', 'BQ'),
    ('Cërrik', 'CR'),
    ('Delvinë', 'DL'),
    ('Devoll', 'DV'),
    ('Dibër', 'DB'),
    ('Dimal', 'DM'),
    ('Divjakë', 'DJ'),
    ('Dropull', 'DP'),
    ('Durrës', 'DR'),
    ('Elbasan', 'EL'),
    ('Fier', 'FR'),
    ('Finiq', 'FN'),
    ('Fushë Arrës', 'FS'),
    ('Gramsh', 'GR'),
    ('Gjirokastër', 'GJ'),
    ('Has', 'HS'),
    ('Himarë', 'HM'),
    ('Kamëz', 'KM'),
    ('Kavajë', 'KV'),
    ('Këlcyrë', 'KL'),
    ('Klos', 'KS'),
    ('Kolonjë', 'KN'),
    ('Konispol', 'KP'),
    ('Korçë', 'KR'),
    ('Krujë', 'KJ'),
    ('Kuçovë', 'KC'),
    ('Kukës', 'KK'),
    ('Kurbin', 'KB'),
    ('Lezhë', 'LZ'),
    ('Libohovë', 'LB'),
    ('Librazhd', 'LR'),
    ('Lushnjë', 'LS'),
    ('Malësi e Madhe', 'ML'),
    ('Maliq', 'MQ'),
    ('Mallakastër', 'MK'),
    ('Mat', 'MT'),
    ('Memaliaj', 'MM'),
    ('Mirditë', 'MR'),
    ('Patos', 'PT'),
    ('Peqin', 'PQ'),
    ('Përmet', 'PR'),
    ('Pogradec', 'PG'),
    ('Poliçan', 'PL'),
    ('Prrenjas', 'PN'),
    ('Pukë', 'PK'),
    ('Pustec', 'PS'),
    ('Roskovec', 'RS'),
    ('Rrogozhinë', 'RR'),
    ('Sarandë', 'SR'),
    ('Selenicë', 'SL'),
    ('Skrapar', 'SK'),
    ('Shijak', 'SJ'),
    ('Shkodër', 'SH'),
    ('Tepelenë', 'TP'),
    ('Tiranë', 'TR'),
    ('Tropojë', 'TJ'),
    ('Vau i Dejës', 'VD'),
    ('Vlorë', 'VL'),
    ('Vorë', 'VR')
       ) AS v (emri, prefiksi)
 WHERE b.emri = v.emri;

ALTER TABLE bashkia
    ALTER COLUMN prefiksi SET NOT NULL,
    ADD CONSTRAINT uq_bashkia_prefiksi UNIQUE (prefiksi),
    ADD CONSTRAINT chk_bashkia_prefiksi CHECK (prefiksi ~ '^[A-Z]{2}$');

COMMENT ON COLUMN bashkia.prefiksi IS 'Dy shkronjat e kodeve të operatorëve të bashkisë (Berat → BR001)';


CREATE TABLE operatori (
    id              INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    bashkia_id      INTEGER      NOT NULL,
    kodi            VARCHAR(10)  NOT NULL,
    emri            VARCHAR(150) NOT NULL,
    aktiv           BOOLEAN      NOT NULL DEFAULT TRUE,
    perdoruesi_id   BIGINT       NOT NULL,
    krijuar_me      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    perditesuar_me  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_operatori_kodi UNIQUE (kodi),
    CONSTRAINT fk_op_bashkia FOREIGN KEY (bashkia_id)
        REFERENCES bashkia (id) ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT fk_op_perdoruesi FOREIGN KEY (perdoruesi_id)
        REFERENCES perdoruesi (id) ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT chk_op_kodi CHECK (kodi ~ '^[A-Z]{2}[0-9]{3,}$'),
    CONSTRAINT chk_op_emri CHECK (length(btrim(emri)) >= 2)
);

CREATE INDEX idx_op_bashkia ON operatori (bashkia_id);

COMMENT ON TABLE  operatori                IS 'Operatorët përgjegjës të skemave ujitëse (F01-03, "KODET E Operatoreve")';
COMMENT ON COLUMN operatori.kodi           IS 'Prefiksi i bashkisë + numër rendor: BR001';
COMMENT ON COLUMN operatori.aktiv          IS 'Statusi: TRUE = Aktiv, FALSE = Jo Aktiv';
COMMENT ON COLUMN operatori.perdoruesi_id  IS 'Përdoruesi që e ndryshoi i fundit';


CREATE TABLE operatori_historiku (
    id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    operatori_id   INTEGER     NOT NULL,
    para           JSONB,
    pas            JSONB       NOT NULL,
    perdoruesi_id  BIGINT      NOT NULL,
    ndryshuar_me   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_oph_operatori FOREIGN KEY (operatori_id)
        REFERENCES operatori (id) ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT fk_oph_perdoruesi FOREIGN KEY (perdoruesi_id)
        REFERENCES perdoruesi (id) ON UPDATE RESTRICT ON DELETE RESTRICT
);

CREATE INDEX idx_oph_operatori ON operatori_historiku (operatori_id, ndryshuar_me);

COMMENT ON TABLE  operatori_historiku      IS 'Historiku i operatorëve: {emri, aktiv} para dhe pas';
COMMENT ON COLUMN operatori_historiku.para IS 'NULL = operatori u krijua';

GRANT SELECT, INSERT                                         ON operatori           TO idmis_app;
GRANT UPDATE (emri, aktiv, perdoruesi_id, perditesuar_me)    ON operatori           TO idmis_app;
GRANT SELECT, INSERT                                         ON operatori_historiku TO idmis_app;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM bashkia WHERE prefiksi IS NULL) OR (SELECT count(*) FROM bashkia) <> 61 THEN
        RAISE EXCEPTION 'prefiksi mungon për një bashki';
    END IF;
END $$;

COMMIT;
