BEGIN;

CREATE TABLE bashkia_kultura (
    bashkia_id     INTEGER     NOT NULL,
    kultura_id     INTEGER     NOT NULL,
    perdoruesi_id  BIGINT      NOT NULL,
    krijuar_me     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_bashkia_kultura PRIMARY KEY (bashkia_id, kultura_id),
    CONSTRAINT fk_bk_bashkia FOREIGN KEY (bashkia_id)
        REFERENCES bashkia (id) ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT fk_bk_kultura FOREIGN KEY (kultura_id)
        REFERENCES kultura (id) ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT fk_bk_perdoruesi FOREIGN KEY (perdoruesi_id)
        REFERENCES perdoruesi (id) ON UPDATE RESTRICT ON DELETE RESTRICT
);

CREATE INDEX idx_bk_kultura ON bashkia_kultura (kultura_id);

COMMENT ON TABLE  bashkia_kultura               IS 'Kulturat e katalogut që kultivohen në secilën bashki';
COMMENT ON COLUMN bashkia_kultura.perdoruesi_id IS 'Përdoruesi që e shtoi kulturën te bashkia';
COMMENT ON COLUMN bashkia_kultura.krijuar_me    IS 'Koha kur kultura u shtua te bashkia';


CREATE TABLE bashkia_kultura_historiku (
    id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    bashkia_id     INTEGER     NOT NULL,
    kultura_id     INTEGER     NOT NULL,
    veprimi        VARCHAR(6)  NOT NULL,
    perdoruesi_id  BIGINT      NOT NULL,
    ndryshuar_me   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_bkh_bashkia FOREIGN KEY (bashkia_id)
        REFERENCES bashkia (id) ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT fk_bkh_kultura FOREIGN KEY (kultura_id)
        REFERENCES kultura (id) ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT fk_bkh_perdoruesi FOREIGN KEY (perdoruesi_id)
        REFERENCES perdoruesi (id) ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT chk_bkh_veprimi CHECK (veprimi IN ('shtuar', 'hequr'))
);

CREATE INDEX idx_bkh_bashkia ON bashkia_kultura_historiku (bashkia_id, ndryshuar_me);

COMMENT ON TABLE  bashkia_kultura_historiku         IS 'Historiku i kulturave të shtuara dhe të hequra te bashkitë';
COMMENT ON COLUMN bashkia_kultura_historiku.veprimi IS 'shtuar = kultura u shtua te bashkia; hequr = u hoq';

GRANT SELECT, INSERT, DELETE ON bashkia_kultura           TO idmis_app;
GRANT SELECT, INSERT         ON bashkia_kultura_historiku TO idmis_app;

COMMIT;
