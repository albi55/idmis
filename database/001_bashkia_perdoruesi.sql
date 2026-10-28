BEGIN;

CREATE FUNCTION vendos_perditesuar_me() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
    NEW.perditesuar_me := NOW();
    RETURN NEW;
END $$;


CREATE TABLE bashkia (
    id             INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    emri           VARCHAR(80) NOT NULL,
    qarku          VARCHAR(60) NOT NULL,
    aktive         BOOLEAN     NOT NULL DEFAULT TRUE,
    krijuar_me     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    perditesuar_me TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_bashkia_emri UNIQUE (emri),
    CONSTRAINT chk_bashkia_emri CHECK (emri = btrim(emri) AND emri <> ''),
    CONSTRAINT chk_bashkia_qarku CHECK (qarku IN (
        'Berat', 'Dibër', 'Durrës', 'Elbasan', 'Fier', 'Gjirokastër',
        'Korçë', 'Kukës', 'Lezhë', 'Shkodër', 'Tiranë', 'Vlorë'))
);

COMMENT ON TABLE  bashkia        IS 'Bashkitë (61), sipas ndarjes territoriale 2015';
COMMENT ON COLUMN bashkia.emri   IS 'Emri zyrtar i bashkisë';
COMMENT ON COLUMN bashkia.qarku  IS 'Qarku ku bën pjesë bashkia (12 qarqe)';
COMMENT ON COLUMN bashkia.aktive IS 'FALSE = bashkia nuk përdoret më; rreshti mbetet për historikun';

CREATE TRIGGER bashkia_perditesuar_me
    BEFORE UPDATE ON bashkia
    FOR EACH ROW EXECUTE FUNCTION vendos_perditesuar_me();


CREATE TABLE perdoruesi (
    id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    emri_perdoruesit  VARCHAR(50)  NOT NULL,
    email             VARCHAR(254) NOT NULL,
    emri_plote        VARCHAR(150) NOT NULL,
    institucioni      VARCHAR(200) NOT NULL,
    fjalekalimi_hash  TEXT         NOT NULL,
    roli              VARCHAR(30)  NOT NULL DEFAULT 'OPERATOR_BASHKIE',
    bashkia_id        INTEGER      NOT NULL,
    aktiv             BOOLEAN      NOT NULL DEFAULT TRUE,
    hyrja_e_fundit    TIMESTAMPTZ,
    krijuar_me        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    perditesuar_me    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_perdoruesi_bashkia FOREIGN KEY (bashkia_id)
        REFERENCES bashkia (id) ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT chk_perdoruesi_emri_perdoruesit
        CHECK (emri_perdoruesit ~ '^[A-Za-z0-9._-]{3,50}$'),
    CONSTRAINT chk_perdoruesi_email
        CHECK (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
    CONSTRAINT chk_perdoruesi_emri_plote
        CHECK (btrim(emri_plote) <> ''),
    CONSTRAINT chk_perdoruesi_institucioni
        CHECK (btrim(institucioni) <> ''),
    CONSTRAINT chk_perdoruesi_fjalekalimi_hash
        CHECK (length(fjalekalimi_hash) >= 50),
    CONSTRAINT chk_perdoruesi_roli
        CHECK (roli IN ('ADMINISTRATOR', 'OPERATOR_BASHKIE'))
);

CREATE UNIQUE INDEX uq_perdoruesi_emri_perdoruesit ON perdoruesi (lower(emri_perdoruesit));
CREATE UNIQUE INDEX uq_perdoruesi_email            ON perdoruesi (lower(email));
CREATE INDEX idx_perdoruesi_bashkia                ON perdoruesi (bashkia_id);

COMMENT ON TABLE  perdoruesi                  IS 'Përdoruesit e IDMIS';
COMMENT ON COLUMN perdoruesi.emri_perdoruesit IS 'Emri për hyrje (3–50 shenja: shkronja, shifra, . _ -), unik';
COMMENT ON COLUMN perdoruesi.email            IS 'Email-i, unik; mund të përdoret për hyrje';
COMMENT ON COLUMN perdoruesi.emri_plote       IS 'Emri dhe mbiemri';
COMMENT ON COLUMN perdoruesi.institucioni     IS 'Institucioni / organizata';
COMMENT ON COLUMN perdoruesi.fjalekalimi_hash IS 'Hash-i i fjalëkalimit, i krijuar nga aplikacioni; fjalëkalimi nuk ruhet kurrë';
COMMENT ON COLUMN perdoruesi.roli             IS 'ADMINISTRATOR ose OPERATOR_BASHKIE';
COMMENT ON COLUMN perdoruesi.bashkia_id       IS 'Bashkia ku punon përdoruesi (e detyrueshme)';
COMMENT ON COLUMN perdoruesi.aktiv            IS 'FALSE = llogaria e çaktivizuar; nuk fshihet për historikun';
COMMENT ON COLUMN perdoruesi.hyrja_e_fundit   IS 'Data dhe ora e hyrjes së fundit';

CREATE TRIGGER perdoruesi_perditesuar_me
    BEFORE UPDATE ON perdoruesi
    FOR EACH ROW EXECUTE FUNCTION vendos_perditesuar_me();


INSERT INTO bashkia (emri, qarku) VALUES
    ('Berat',          'Berat'),
    ('Dimal',          'Berat'),
    ('Kuçovë',         'Berat'),
    ('Poliçan',        'Berat'),
    ('Skrapar',        'Berat'),
    ('Bulqizë',        'Dibër'),
    ('Dibër',          'Dibër'),
    ('Klos',           'Dibër'),
    ('Mat',            'Dibër'),
    ('Durrës',         'Durrës'),
    ('Krujë',          'Durrës'),
    ('Shijak',         'Durrës'),
    ('Belsh',          'Elbasan'),
    ('Cërrik',         'Elbasan'),
    ('Elbasan',        'Elbasan'),
    ('Gramsh',         'Elbasan'),
    ('Librazhd',       'Elbasan'),
    ('Peqin',          'Elbasan'),
    ('Prrenjas',       'Elbasan'),
    ('Divjakë',        'Fier'),
    ('Fier',           'Fier'),
    ('Lushnjë',        'Fier'),
    ('Mallakastër',    'Fier'),
    ('Patos',          'Fier'),
    ('Roskovec',       'Fier'),
    ('Dropull',        'Gjirokastër'),
    ('Gjirokastër',    'Gjirokastër'),
    ('Këlcyrë',        'Gjirokastër'),
    ('Libohovë',       'Gjirokastër'),
    ('Memaliaj',       'Gjirokastër'),
    ('Përmet',         'Gjirokastër'),
    ('Tepelenë',       'Gjirokastër'),
    ('Devoll',         'Korçë'),
    ('Kolonjë',        'Korçë'),
    ('Korçë',          'Korçë'),
    ('Maliq',          'Korçë'),
    ('Pogradec',       'Korçë'),
    ('Pustec',         'Korçë'),
    ('Has',            'Kukës'),
    ('Kukës',          'Kukës'),
    ('Tropojë',        'Kukës'),
    ('Kurbin',         'Lezhë'),
    ('Lezhë',          'Lezhë'),
    ('Mirditë',        'Lezhë'),
    ('Fushë Arrës',    'Shkodër'),
    ('Malësi e Madhe', 'Shkodër'),
    ('Pukë',           'Shkodër'),
    ('Shkodër',        'Shkodër'),
    ('Vau i Dejës',    'Shkodër'),
    ('Kamëz',          'Tiranë'),
    ('Kavajë',         'Tiranë'),
    ('Rrogozhinë',     'Tiranë'),
    ('Tiranë',         'Tiranë'),
    ('Vorë',           'Tiranë'),
    ('Delvinë',        'Vlorë'),
    ('Finiq',          'Vlorë'),
    ('Himarë',         'Vlorë'),
    ('Konispol',       'Vlorë'),
    ('Sarandë',        'Vlorë'),
    ('Selenicë',       'Vlorë'),
    ('Vlorë',          'Vlorë');

COMMIT;
