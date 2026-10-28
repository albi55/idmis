BEGIN;

CREATE TABLE njesia_zona_historiku (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    njesia_id           INTEGER     NOT NULL,
    zona_e_meparshme_id SMALLINT    NOT NULL,
    zona_e_re_id        SMALLINT    NOT NULL,
    perdoruesi_id       BIGINT      NOT NULL,
    ndryshuar_me        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_nzh_njesia FOREIGN KEY (njesia_id)
        REFERENCES njesia_administrative (id) ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT fk_nzh_zona_meparshme FOREIGN KEY (zona_e_meparshme_id)
        REFERENCES zona_agroklimatike (id) ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT fk_nzh_zona_re FOREIGN KEY (zona_e_re_id)
        REFERENCES zona_agroklimatike (id) ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT fk_nzh_perdoruesi FOREIGN KEY (perdoruesi_id)
        REFERENCES perdoruesi (id) ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT chk_nzh_zona_ndryshon CHECK (zona_e_meparshme_id <> zona_e_re_id)
);

CREATE INDEX idx_nzh_njesia ON njesia_zona_historiku (njesia_id, ndryshuar_me);

COMMENT ON TABLE  njesia_zona_historiku               IS 'Historiku i ndryshimeve të zonës agroklimatike të njësive administrative';
COMMENT ON COLUMN njesia_zona_historiku.perdoruesi_id IS 'Përdoruesi që bëri ndryshimin';

GRANT UPDATE (zona_id) ON njesia_administrative TO idmis_app;
GRANT SELECT, INSERT   ON njesia_zona_historiku  TO idmis_app;

COMMIT;
