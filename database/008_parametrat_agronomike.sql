BEGIN;

CREATE TABLE klima_mujore (
    zona_id             SMALLINT     NOT NULL,
    muaji               SMALLINT     NOT NULL,
    eto_mm_dite         NUMERIC(4,1) NOT NULL,
    reshjet_efektive_mm NUMERIC(6,1),
    burimi              VARCHAR(200) NOT NULL,
    krijuar_me          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    perditesuar_me      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_klima_mujore PRIMARY KEY (zona_id, muaji),
    CONSTRAINT fk_klima_zona FOREIGN KEY (zona_id)
        REFERENCES zona_agroklimatike (id) ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT chk_klima_muaji CHECK (muaji BETWEEN 1 AND 12),
    CONSTRAINT chk_klima_eto CHECK (eto_mm_dite BETWEEN 0 AND 15),
    CONSTRAINT chk_klima_reshjet CHECK (reshjet_efektive_mm IS NULL OR reshjet_efektive_mm >= 0)
);

COMMENT ON TABLE  klima_mujore                     IS 'Të dhënat klimatike mujore sipas zonës agroklimatike';
COMMENT ON COLUMN klima_mujore.eto_mm_dite         IS 'Evapotranspirimi referencë ET₀, mm/ditë (mesatare e muajit)';
COMMENT ON COLUMN klima_mujore.reshjet_efektive_mm IS 'Reshjet efektive të muajit, mm; NULL = ende pa të dhëna';

CREATE TRIGGER klima_mujore_perditesuar_me
    BEFORE UPDATE ON klima_mujore
    FOR EACH ROW EXECUTE FUNCTION vendos_perditesuar_me();

INSERT INTO klima_mujore (zona_id, muaji, eto_mm_dite, burimi)
SELECT z.id, v.muaji, v.eto, 'ETo orientuese (mm_ditë).xlsx'
  FROM (VALUES
    ('Z1', 1, 0.8), ('Z2', 1, 0.7), ('Z3', 1, 0.8), ('Z4', 1, 0.5),
    ('Z1', 2, 1.2), ('Z2', 2, 1.1), ('Z3', 2, 1.2), ('Z4', 2, 0.8),
    ('Z1', 3, 2.0), ('Z2', 3, 1.8), ('Z3', 3, 2.0), ('Z4', 3, 1.4),
    ('Z1', 4, 3.0), ('Z2', 4, 2.7), ('Z3', 4, 3.0), ('Z4', 4, 2.2),
    ('Z1', 5, 4.0), ('Z2', 5, 3.6), ('Z3', 5, 4.0), ('Z4', 5, 3.0),
    ('Z1', 6, 4.8), ('Z2', 6, 4.4), ('Z3', 6, 4.9), ('Z4', 6, 3.8),
    ('Z1', 7, 5.5), ('Z2', 7, 5.0), ('Z3', 7, 5.6), ('Z4', 7, 4.4),
    ('Z1', 8, 5.0), ('Z2', 8, 4.6), ('Z3', 8, 5.1), ('Z4', 8, 4.0),
    ('Z1', 9, 3.6), ('Z2', 9, 3.3), ('Z3', 9, 3.7), ('Z4', 9, 2.8),
    ('Z1', 10, 2.3), ('Z2', 10, 2.1), ('Z3', 10, 2.3), ('Z4', 10, 1.7),
    ('Z1', 11, 1.3), ('Z2', 11, 1.2), ('Z3', 11, 1.3), ('Z4', 11, 0.9),
    ('Z1', 12, 0.8), ('Z2', 12, 0.7), ('Z3', 12, 0.8), ('Z4', 12, 0.5)
       ) AS v (zona, muaji, eto)
  JOIN zona_agroklimatike z ON z.kodi = v.zona;


CREATE TABLE profili_kultures (
    id                  INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    zona_id             SMALLINT     NOT NULL,
    rendi               SMALLINT     NOT NULL,
    kodi                VARCHAR(14)  NOT NULL,
    kodi_excel          VARCHAR(14),
    emri                VARCHAR(120) NOT NULL,
    kultura_id          INTEGER,
    kc_ini              NUMERIC(3,2),
    kc_mid              NUMERIC(3,2),
    kc_end              NUMERIC(3,2),
    muaji_mbjelljes     SMALLINT,
    mbjellja_orientuese VARCHAR(200),
    statusi_validimit   VARCHAR(30)  NOT NULL DEFAULT 'teorik',
    burimi              VARCHAR(200) NOT NULL,
    shenim              VARCHAR(300),
    krijuar_me          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    perditesuar_me      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_profili_zona_kodi  UNIQUE (zona_id, kodi),
    CONSTRAINT uq_profili_zona_emri  UNIQUE (zona_id, emri),
    CONSTRAINT uq_profili_zona_rendi UNIQUE (zona_id, rendi),
    CONSTRAINT fk_profili_zona FOREIGN KEY (zona_id)
        REFERENCES zona_agroklimatike (id) ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT fk_profili_kultura FOREIGN KEY (kultura_id)
        REFERENCES kultura (id) ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT chk_profili_kodi  CHECK (kodi ~ '^AL-CROP-[0-9]{6}$'),
    CONSTRAINT chk_profili_emri  CHECK (emri = btrim(emri) AND emri <> ''),
    CONSTRAINT chk_profili_rendi CHECK (rendi > 0),
    CONSTRAINT chk_profili_kc CHECK (
        (kc_ini IS NULL OR kc_ini BETWEEN 0 AND 2) AND
        (kc_mid IS NULL OR kc_mid BETWEEN 0 AND 2) AND
        (kc_end IS NULL OR kc_end BETWEEN 0 AND 2)),
    CONSTRAINT chk_profili_muaji CHECK (muaji_mbjelljes BETWEEN 1 AND 12),
    CONSTRAINT chk_profili_statusi CHECK (statusi_validimit IN (
        'teorik', 'shqyrtuar_nga_bashkia', 'validuar_agronomikisht', 'miratuar_institucionalisht'))
);

CREATE INDEX idx_profili_kultura ON profili_kultures (kultura_id);

COMMENT ON TABLE  profili_kultures                     IS 'Parametrat agronomikë të kulturës sipas zonës (FAO-56): Kc, muaji i mbjelljes, statusi';
COMMENT ON COLUMN profili_kultures.rendi               IS 'Renditja në tabelë (si në Excel)';
COMMENT ON COLUMN profili_kultures.kodi                IS 'Kodi IDMIS i tabelës së zonës (kolona D, lista me 118 kultura); NUK është kodi i tabelës kultura';
COMMENT ON COLUMN profili_kultures.kodi_excel          IS 'Kolona B "crop_code" e Excel-it; vetëm për gjurmim';
COMMENT ON COLUMN profili_kultures.kultura_id          IS 'Kultura e katalogut (006) me të njëjtin emër; NULL = pa lidhje ende';
COMMENT ON COLUMN profili_kultures.muaji_mbjelljes     IS 'Muaji kur fillon faza 1 (1 = Janar … 12 = Dhjetor); llogaritja nis në ditën 1 të tij';
COMMENT ON COLUMN profili_kultures.mbjellja_orientuese IS 'Kolona "Mbjellja orientuese" e Excel-it';
COMMENT ON COLUMN profili_kultures.statusi_validimit   IS 'teorik, shqyrtuar_nga_bashkia, validuar_agronomikisht, miratuar_institucionalisht';
COMMENT ON COLUMN profili_kultures.burimi              IS 'Burimi i parametrave';

CREATE TRIGGER profili_kultures_perditesuar_me
    BEFORE UPDATE ON profili_kultures
    FOR EACH ROW EXECUTE FUNCTION vendos_perditesuar_me();

INSERT INTO profili_kultures (zona_id, rendi, kodi, kodi_excel, emri, kultura_id, kc_ini, kc_mid, kc_end,
                              muaji_mbjelljes, mbjellja_orientuese, burimi, shenim)
SELECT z.id, v.rendi, v.kodi, v.kodi_excel, v.emri, k.id, v.kc_ini, v.kc_mid, v.kc_end,
       v.muaji, v.mbjellja, 'zona 1 e perfunduar.xlsx', v.shenim
  FROM (VALUES
    (1, 'AL-CROP-000001', 'AL-CROP-000001', 'Grurë', 'AL-CROP-000001', 0.30, 1.15, 0.25, 11, 'Tetor–Dhjetor', NULL),
    (2, 'AL-CROP-000002', 'AL-CROP-000002', 'Elb', 'AL-CROP-000004', 0.30, 1.15, 0.25, 11, 'Tetor–Dhjetor', NULL),
    (3, 'AL-CROP-000003', 'AL-CROP-000003', 'Misër për kokërr', 'AL-CROP-000002', 0.30, 1.20, 0.60, 4, 'Prill–Maj', NULL),
    (4, 'AL-CROP-000004', 'AL-CROP-000004', 'Misër për silazh', 'AL-CROP-000003', 0.30, 1.15, 0.90, 4, 'Prill–Maj', NULL),
    (5, 'AL-CROP-000005', 'AL-CROP-000005', 'Oriz', 'AL-CROP-000007', 1.05, 1.20, 0.90, 4, 'Prill–Maj', NULL),
    (6, 'AL-CROP-000006', 'AL-CROP-000006', 'Tërshërë', 'AL-CROP-000006', 0.30, 1.15, 0.25, 11, 'Tetor–Dhjetor', NULL),
    (7, 'AL-CROP-000007', 'AL-CROP-000007', 'Thekër', 'AL-CROP-000005', 0.30, 1.15, 0.25, 10, 'Tetor–Nëntor', NULL),
    (8, 'AL-CROP-000008', 'AL-CROP-000008', 'Sorgum', 'AL-CROP-000008', 0.30, 1.10, 0.65, 5, 'Prill–Qershor', NULL),
    (9, 'AL-CROP-000009', 'AL-CROP-000009', 'Patate', 'AL-CROP-000401', 0.50, 1.15, 0.75, 3, 'Shkurt–Prill; verë në zonat e freskëta', NULL),
    (10, 'AL-CROP-000010', 'AL-CROP-000010', 'Patate e ëmbël', 'AL-CROP-000402', 0.50, 1.15, 0.65, 4, 'Prill–Maj', NULL),
    (11, 'AL-CROP-000011', 'AL-CROP-000101', 'Domate', 'AL-CROP-000301', 0.60, 1.15, 0.80, 4, 'Mars–Maj, sipas mënyrës së mbjelljes', NULL),
    (12, 'AL-CROP-000012', 'AL-CROP-000102', 'Domate në serë', NULL, 0.60, 1.15, 0.80, NULL, 'Sipas ciklit të serës', NULL),
    (13, 'AL-CROP-000013', 'AL-CROP-000103', 'Spec', 'AL-CROP-000302', 0.60, 1.05, 0.90, 4, 'Mars–Maj', NULL),
    (14, 'AL-CROP-000014', 'AL-CROP-000104', 'Kastravec', 'AL-CROP-000304', 0.60, 1.00, 0.75, 4, 'Mars–Maj; edhe në cikle të tjera', NULL),
    (15, 'AL-CROP-000015', 'AL-CROP-000105', 'Kastravec në serë', NULL, 0.60, 1.00, 0.75, NULL, 'Sipas ciklit të serës', NULL),
    (16, 'AL-CROP-000016', 'AL-CROP-000106', 'Pjepër', 'AL-CROP-000308', 0.50, 1.05, 0.75, 4, 'Prill–Maj', NULL),
    (17, 'AL-CROP-000017', 'AL-CROP-000107', 'Shalqi', 'AL-CROP-000307', 0.40, 1.00, 0.75, 4, 'Prill–Maj', NULL),
    (18, 'AL-CROP-000018', 'AL-CROP-000108', 'Qepë', 'AL-CROP-000403', 0.70, 1.05, 0.75, 2, 'Vjeshtë ose fund dimri/pranverë', NULL),
    (19, 'AL-CROP-000019', 'AL-CROP-000109', 'Lakër jonxhë?', 'AL-CROP-000109', NULL, NULL, NULL, NULL, 'Në pritje të konfirmimit', NULL),
    (20, 'AL-CROP-000020', 'AL-CROP-000110', 'Hudhër', 'AL-CROP-000404', 0.70, 1.00, 0.70, 10, 'Tetor–Nëntor; edhe sipas zonës', NULL),
    (21, 'AL-CROP-000021', 'AL-CROP-000201', 'Karotë', 'AL-CROP-000406', 0.70, 1.05, 0.95, 3, 'Shkurt–Prill; Gusht–Tetor', NULL),
    (22, 'AL-CROP-000022', 'AL-CROP-000202', 'Panxhar i kuq', 'AL-CROP-000407', 0.70, 1.05, 0.95, 3, 'Shkurt–Maj; Gusht–Shtator', NULL),
    (23, 'AL-CROP-000023', 'AL-CROP-000203', 'Lulelakër', 'AL-CROP-000205', 0.70, 1.05, 0.95, 8, 'Korrik–Shtator për ciklin vjeshtë-dimër', NULL),
    (24, 'AL-CROP-000024', 'AL-CROP-000204', 'Brokoli', 'AL-CROP-000206', 0.70, 1.05, 0.95, 8, 'Korrik–Shtator', NULL),
    (25, 'AL-CROP-000025', 'AL-CROP-000205', 'Lakër e bardhë', 'AL-CROP-000203', 0.70, 1.05, 0.95, 8, 'Korrik–Shtator; varet nga varieteti', NULL),
    (26, 'AL-CROP-000026', 'AL-CROP-000206', 'Marule', NULL, 0.70, 1.00, 0.95, 11, 'Shtator–Prill', NULL),
    (27, 'AL-CROP-000027', 'AL-CROP-000207', 'Spinaq', 'AL-CROP-000202', 0.70, 1.00, 0.95, 11, 'Shtator–Mars', NULL),
    (28, 'AL-CROP-000028', 'AL-CROP-000208', 'Fasule', NULL, 0.50, 1.05, 0.90, 5, 'Prill–Qershor', NULL),
    (29, 'AL-CROP-000029', 'AL-CROP-000209', 'Bizele', NULL, 0.50, 1.15, 1.10, 11, 'Tetor–Dhjetor ose Shkurt', 'Kc_end: 1.10*'),
    (30, 'AL-CROP-000030', 'AL-CROP-000210', 'Qiqra', 'AL-CROP-000105', 0.40, 1.00, 0.35, 3, 'Shkurt–Mars', NULL),
    (31, 'AL-CROP-000031', 'AL-CROP-000301', 'Thjerrëza', 'AL-CROP-000106', 0.40, 1.10, 0.30, 3, 'Shkurt–Mars', NULL),
    (32, 'AL-CROP-000032', 'AL-CROP-000302', 'Bamje', 'AL-CROP-000309', 0.50, 1.00, 0.90, 4, 'Prill–Maj', NULL),
    (33, 'AL-CROP-000033', 'AL-CROP-000303', 'Patëllxhan', 'AL-CROP-000303', 0.60, 1.05, 0.90, 4, 'Mars–Maj', NULL),
    (34, 'AL-CROP-000034', 'AL-CROP-000304', 'Kungull', NULL, 0.50, 1.00, 0.80, 4, 'Prill–Maj', NULL),
    (35, 'AL-CROP-000035', 'AL-CROP-000305', 'Kungull i njomë', 'AL-CROP-000305', 0.50, 0.95, 0.75, 3, 'Mars–Qershor', NULL),
    (36, 'AL-CROP-000036', 'AL-CROP-000306', 'Luleshtrydhe', 'AL-CROP-000714', 0.40, 0.85, 0.75, 10, 'Shtator–Nëntor; sipas sistemit', NULL),
    (37, 'AL-CROP-000037', 'AL-CROP-000307', 'Mjedër', 'AL-CROP-000715', 0.30, 0.90, 0.75, NULL, 'Mbjellje në periudhën e fjetjes', 'TCo: Sezonale'),
    (38, 'AL-CROP-000038', 'AL-CROP-000308', 'Boronicë', NULL, 0.30, 0.80, 0.70, NULL, 'Vjeshtë ose pranverë', 'TCo: Sezonale'),
    (39, 'AL-CROP-000039', 'AL-CROP-000309', 'Arra', NULL, 0.50, 1.10, 0.80, NULL, 'Vjeshtë ose fund dimri', 'TCo: Sezonale'),
    (40, 'AL-CROP-000040', 'AL-CROP-000310', 'Lajthi', 'AL-CROP-000908', 0.50, 1.10, 0.80, NULL, 'Vjeshtë ose fund dimri', 'TCo: Sezonale'),
    (41, 'AL-CROP-000041', 'AL-CROP-000401', 'Kumbull', 'AL-CROP-000706', 0.50, 0.95, 0.70, 3, 'Sezoni pranverë–vjeshtë', NULL),
    (42, 'AL-CROP-000042', 'AL-CROP-000402', 'Qershi', 'AL-CROP-000708', 0.50, 0.90, 0.70, 3, 'Pranverë–verë', NULL),
    (43, 'AL-CROP-000043', 'AL-CROP-000403', 'Vishnje', 'AL-CROP-000709', 0.50, 0.90, 0.70, 3, 'Pranverë–verë', NULL),
    (44, 'AL-CROP-000044', 'AL-CROP-000404', 'Pjeshkë', 'AL-CROP-000704', 0.50, 1.05, 0.80, 3, 'Pranverë–vjeshtë', NULL),
    (45, 'AL-CROP-000045', 'AL-CROP-000405', 'Nektarinë', 'AL-CROP-000705', 0.50, 1.05, 0.80, 3, 'Pranverë–vjeshtë', NULL),
    (46, 'AL-CROP-000046', 'AL-CROP-000406', 'Kajsi', 'AL-CROP-000707', 0.50, 0.90, 0.70, 3, 'Pranverë–verë', NULL),
    (47, 'AL-CROP-000047', 'AL-CROP-000407', 'Mollë', 'AL-CROP-000701', 0.50, 1.05, 0.80, 3, 'Pranverë–vjeshtë', NULL),
    (48, 'AL-CROP-000048', 'AL-CROP-000408', 'Dardhë', 'AL-CROP-000702', 0.50, 1.00, 0.75, 3, 'Pranverë–vjeshtë', NULL),
    (49, 'AL-CROP-000049', 'AL-CROP-000409', 'Ftua', NULL, 0.50, 0.95, 0.70, 3, 'Pranverë–vjeshtë', NULL),
    (50, 'AL-CROP-000050', 'AL-CROP-000501', 'Patëllxhan?', NULL, NULL, NULL, NULL, NULL, 'Emri duhet konfirmuar', NULL),
    (51, 'AL-CROP-000051', 'AL-CROP-000502', 'Shegë', 'AL-CROP-000710', 0.50, 0.90, 0.65, 3, 'Pranverë–vjeshtë', NULL),
    (52, 'AL-CROP-000052', 'AL-CROP-000503', 'Fik', 'AL-CROP-000711', 0.50, 0.90, 0.65, 3, 'Pranverë–vjeshtë', NULL),
    (53, 'AL-CROP-000053', 'AL-CROP-000504', 'Hurmë japoneze', NULL, 0.50, 0.95, 0.70, 3, 'Pranverë–vjeshtë', NULL),
    (54, 'AL-CROP-000054', 'AL-CROP-000505', 'Kiwi', NULL, 0.50, 1.05, 0.80, 3, 'Pranverë–vjeshtë', NULL),
    (55, 'AL-CROP-000055', 'AL-CROP-000506', 'Rrush për tryezë', NULL, 0.30, 0.85, 0.45, 3, 'Pranverë–vjeshtë', NULL),
    (56, 'AL-CROP-000056', 'AL-CROP-000507', 'Rrush për verë', 'AL-CROP-000903', 0.30, 0.70, 0.45, 3, 'Pranverë–vjeshtë', NULL),
    (57, 'AL-CROP-000057', 'AL-CROP-000508', 'Rrush i thatë', 'AL-CROP-000905', 0.30, 0.85, 0.45, 3, 'Pranverë–vjeshtë', NULL),
    (58, 'AL-CROP-000058', 'AL-CROP-000509', 'Portokall', 'AL-CROP-000801', 0.65, 0.70, 0.65, NULL, 'Sipas sezonit dhe klimës', NULL),
    (59, 'AL-CROP-000059', 'AL-CROP-000510', 'Mandarinë', NULL, 0.65, 0.70, 0.65, NULL, 'Sipas sezonit dhe klimës', NULL),
    (60, 'AL-CROP-000060', 'AL-CROP-000601', 'Limon', 'AL-CROP-000803', 0.65, 0.70, 0.65, NULL, 'Sipas sezonit dhe klimës', NULL),
    (61, 'AL-CROP-000061', 'AL-CROP-000602', 'Qitro', NULL, 0.65, 0.70, 0.65, NULL, 'Sezon i gjatë; sipas zonës', NULL),
    (62, 'AL-CROP-000062', 'AL-CROP-000603', 'Avokado', NULL, 0.60, 0.85, 0.75, 3, 'Pranverë–vjeshtë; sipas klimës', NULL),
    (63, 'AL-CROP-000063', 'AL-CROP-000604', 'Ullinj', NULL, 0.50, 0.70, 0.60, 3, 'Pranverë–vjeshtë', NULL),
    (64, 'AL-CROP-000064', 'AL-CROP-000605', 'Bajame', 'AL-CROP-000907', 0.50, 0.90, 0.65, 3, 'Pranverë–verë', NULL),
    (65, 'AL-CROP-000065', 'AL-CROP-000606', 'Pistak', NULL, 0.50, 0.90, 0.65, 3, 'Pranverë–verë', NULL),
    (66, 'AL-CROP-000066', 'AL-CROP-000607', 'Gështenjë', 'AL-CROP-000909', 0.50, 0.90, 0.70, 3, 'Pranverë–vjeshtë', NULL),
    (67, 'AL-CROP-000067', 'AL-CROP-000608', 'Arrë pishe', NULL, NULL, NULL, NULL, NULL, 'Kërkon profil të veçantë sipas sistemit të kultivimit', NULL),
    (68, 'AL-CROP-000068', 'AL-CROP-000609', 'Jonxhë', 'AL-CROP-000501', 0.40, 1.05, 0.90, 4, 'Shumëvjeçare; disa kositje', NULL),
    (69, 'AL-CROP-000069', 'AL-CROP-000610', 'Tërfil i kuq', 'AL-CROP-000502', 0.40, 1.05, 0.85, 4, 'Pranverë–verë; sipas mbjelljes', NULL),
    (70, 'AL-CROP-000070', 'AL-CROP-000701', 'Tërfil i bardhë', 'AL-CROP-000503', 0.40, 1.00, 0.90, 4, 'Shumëvjeçar', NULL),
    (71, 'AL-CROP-000071', 'AL-CROP-000702', 'Lolium shumëvjeçar', NULL, 0.40, 1.00, 0.90, 4, 'Shumëvjeçar', NULL),
    (72, 'AL-CROP-000072', 'AL-CROP-000703', 'Lolium njëvjeçar', NULL, 0.40, 1.00, 0.85, 4, 'Vjeshtë–pranverë', NULL),
    (73, 'AL-CROP-000073', 'AL-CROP-000704', 'Festukë', 'AL-CROP-000506', 0.40, 1.00, 0.90, 4, 'Shumëvjeçare', NULL),
    (74, 'AL-CROP-000074', 'AL-CROP-000705', 'Dactylis', NULL, 0.40, 1.00, 0.90, 4, 'Shumëvjeçare', NULL),
    (75, 'AL-CROP-000075', 'AL-CROP-000706', 'Luledielli', 'AL-CROP-000601', 0.35, 1.10, 0.35, 4, 'Prill–Maj', NULL),
    (76, 'AL-CROP-000076', 'AL-CROP-000707', 'Sojë', 'AL-CROP-000108', 0.40, 1.15, 0.50, 4, 'Prill–Maj', NULL),
    (77, 'AL-CROP-000077', 'AL-CROP-000708', 'Kikirik', 'AL-CROP-000604', 0.40, 1.10, 0.60, 4, 'Prill–Maj', NULL),
    (78, 'AL-CROP-000078', 'AL-CROP-000709', 'Rapë', NULL, 0.35, 1.10, 0.35, NULL, 'Vjeshtë, sipas llojit', NULL),
    (79, 'AL-CROP-000079', 'AL-CROP-000710', 'Temjan i zi (susam)', NULL, 0.35, 1.10, 0.25, 4, 'Prill–Maj', NULL),
    (80, 'AL-CROP-000080', 'AL-CROP-000711', 'Kanabis industrial', NULL, NULL, NULL, NULL, NULL, 'Profil vetëm pas përcaktimit të tipit dhe ciklit të autorizuar', NULL),
    (81, 'AL-CROP-000081', 'AL-CROP-000712', 'Pambuk', 'AL-CROP-000606', 0.35, 1.15, 0.60, 4, 'Prill–Maj', NULL),
    (82, 'AL-CROP-000082', 'AL-CROP-000713', 'Grumbullim bimësh aromatike', NULL, NULL, NULL, NULL, NULL, 'Sipas species', NULL),
    (83, 'AL-CROP-000083', 'AL-CROP-000714', 'Livandë', NULL, 0.30, 0.75, 0.50, NULL, 'Profil sezonal', NULL),
    (84, 'AL-CROP-000084', 'AL-CROP-000715', 'Rozmarinë', 'AL-CROP-001002', 0.30, 0.75, 0.50, NULL, 'Profil sezonal', NULL),
    (85, 'AL-CROP-000085', 'AL-CROP-000716', 'Sherebelë', 'AL-CROP-001001', 0.30, 0.75, 0.50, NULL, 'Profil sezonal', NULL),
    (86, 'AL-CROP-000086', 'AL-CROP-000801', 'Mente', 'AL-CROP-001006', 0.50, 1.00, 0.85, NULL, 'Pranverë–vjeshtë; disa korrje', NULL),
    (87, 'AL-CROP-000087', 'AL-CROP-000802', 'Oregano', NULL, 0.30, 0.75, 0.50, NULL, 'Profil sezonal', NULL),
    (88, 'AL-CROP-000088', 'AL-CROP-000803', 'Trumzë', 'AL-CROP-001005', 0.30, 0.75, 0.50, NULL, 'Profil sezonal', NULL),
    (89, 'AL-CROP-000089', 'AL-CROP-000804', 'Koriandër', NULL, 0.40, 1.00, 0.35, NULL, 'Vjeshtë ose pranverë', NULL),
    (90, 'AL-CROP-000090', 'AL-CROP-000805', 'Majdanoz', NULL, 0.50, 1.00, 0.90, NULL, 'Sipas ciklit dhe korrjes', NULL),
    (91, 'AL-CROP-000091', 'AL-CROP-000901', 'Borzilok', 'AL-CROP-001007', 0.50, 1.00, 0.80, 5, 'Prill–Qershor', NULL),
    (92, 'AL-CROP-000092', 'AL-CROP-000902', 'Finok', NULL, 0.50, 1.00, 0.80, NULL, 'Pranverë ose vjeshtë', NULL),
    (93, 'AL-CROP-000093', 'AL-CROP-000903', 'Anason', NULL, 0.40, 1.00, 0.30, 3, 'Shkurt–Prill', NULL),
    (94, 'AL-CROP-000094', 'AL-CROP-000904', 'Kimel (qimnon)', NULL, 0.35, 1.00, 0.25, NULL, 'Pranverë', NULL),
    (95, 'AL-CROP-000095', 'AL-CROP-000905', 'Duhan', 'AL-CROP-000607', 0.35, 1.10, 0.90, 4, 'Prill–Maj', NULL),
    (96, 'AL-CROP-000096', 'AL-CROP-000906', 'Trëndafil për esenca', NULL, 0.40, 0.90, 0.70, NULL, 'Profil sezonal', NULL),
    (97, 'AL-CROP-000097', 'AL-CROP-000907', 'Grurë foragjer', NULL, 0.30, 1.15, 0.35, NULL, 'Vjeshtë', NULL),
    (98, 'AL-CROP-000098', 'AL-CROP-000908', 'Misër foragjer', 'AL-CROP-000508', 0.30, 1.15, 0.90, 4, 'Prill–Maj', NULL),
    (99, 'AL-CROP-000099', 'AL-CROP-000909', 'Përzierje barërash foragjere', NULL, NULL, NULL, NULL, NULL, 'Sipas përbërjes', NULL),
    (100, 'AL-CROP-000100', 'AL-CROP-000910', 'Kullotë e përmirësuar', NULL, NULL, NULL, NULL, NULL, 'Sipas përbërjes dhe menaxhimit', NULL),
    (101, 'AL-CROP-000101', 'AL-CROP-001001', 'Kullotë natyrore', NULL, NULL, NULL, NULL, NULL, 'Sipas mbulesës bimore', NULL),
    (102, 'AL-CROP-000102', 'AL-CROP-001002', 'Lëndinë/bar dekorativ', NULL, NULL, NULL, NULL, NULL, 'Sipas llojit dhe mirëmbajtjes', NULL),
    (103, 'AL-CROP-000103', 'AL-CROP-001003', 'Shparg', NULL, 0.50, 0.95, 0.75, 4, 'Profil sezonal', NULL),
    (104, 'AL-CROP-000104', 'AL-CROP-001004', 'Angjinare', NULL, 0.50, 1.00, 0.85, 4, 'Sipas ciklit dhe zonës', NULL),
    (105, 'AL-CROP-000105', 'AL-CROP-001005', 'Rrepkë', 'AL-CROP-000408', 0.70, 1.00, 0.90, 4, 'Pothuajse gjatë gjithë vitit, sipas temperaturës', NULL),
    (106, 'AL-CROP-000106', 'AL-CROP-001006', 'Sallatë rukola', NULL, 0.70, 1.00, 0.90, 9, 'Vjeshtë–pranverë', NULL),
    (107, 'AL-CROP-000107', 'AL-CROP-001007', 'Presh', 'AL-CROP-000207', 0.50, 1.05, 0.90, 4, 'Pranverë–verë', NULL),
    (108, 'AL-CROP-000108', 'AL-CROP-001008', 'Selino', 'AL-CROP-000208', 0.50, 1.05, 0.90, 4, 'Pranverë–verë', NULL),
    (109, 'AL-CROP-000109', 'AL-CROP-001009', 'Asparagus dekorativ', NULL, NULL, NULL, NULL, NULL, 'Sipas species dhe sistemit', NULL),
    (110, 'AL-CROP-000110', 'AL-CROP-001010', 'Fidanë pemësh frutore', NULL, NULL, NULL, NULL, NULL, 'Sipas species dhe moshës', NULL),
    (111, 'AL-CROP-000111', 'AL-CROP-001011', 'Fidanë ulliri', 'AL-CROP-001103', NULL, NULL, NULL, NULL, 'Sipas moshës dhe enës/tokës', NULL),
    (112, 'AL-CROP-000112', 'AL-CROP-001101', 'Fidanë agrumesh', 'AL-CROP-001102', NULL, NULL, NULL, NULL, 'Sipas species dhe moshës', NULL),
    (113, 'AL-CROP-000113', 'AL-CROP-001102', 'Fidanë perimesh', 'AL-CROP-001105', NULL, NULL, NULL, NULL, 'Sipas kulturës dhe fazës së fidanit', NULL),
    (114, 'AL-CROP-000114', 'AL-CROP-001103', 'Lule të prera', 'AL-CROP-000610', NULL, NULL, NULL, NULL, 'Sipas species dhe fushës/serës', NULL),
    (115, 'AL-CROP-000115', 'AL-CROP-001104', 'Lule në vazo', NULL, NULL, NULL, NULL, NULL, 'Sipas species dhe substratit', NULL),
    (116, 'AL-CROP-000116', 'AL-CROP-001105', 'Bimë dekorative në fidanishte', NULL, NULL, NULL, NULL, NULL, 'Sipas species dhe madhësisë', NULL),
    (117, 'AL-CROP-000117', 'AL-CROP-001106', 'Të tjera – kultura bujqësore', NULL, NULL, NULL, NULL, NULL, 'Plotësohet kur identifikohet kultura', NULL),
    (118, 'AL-CROP-000118', NULL, 'Të tjera – kultura shumëvjeçare', NULL, NULL, NULL, NULL, NULL, 'Plotësohet kur identifikohet kultura', NULL)
       ) AS v (rendi, kodi, kodi_excel, emri, kultura_kodi, kc_ini, kc_mid, kc_end, muaji, mbjellja, shenim)
  JOIN zona_agroklimatike z ON z.kodi = 'Z1'
  LEFT JOIN kultura k ON k.kodi = v.kultura_kodi;


CREATE TABLE profili_faza (
    profili_id  INTEGER     NOT NULL,
    nr          SMALLINT    NOT NULL,
    emri        VARCHAR(30) GENERATED ALWAYS AS (CASE nr
                    WHEN 1 THEN 'Faza fillestare'
                    WHEN 2 THEN 'Zhvillimi'
                    WHEN 3 THEN 'Mesi i sezonit'
                    WHEN 4 THEN 'Fundi i sezonit' END) STORED,
    ditet       SMALLINT    NOT NULL,

    CONSTRAINT pk_profili_faza PRIMARY KEY (profili_id, nr),
    CONSTRAINT fk_faza_profili FOREIGN KEY (profili_id)
        REFERENCES profili_kultures (id) ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT chk_faza_nr    CHECK (nr BETWEEN 1 AND 4),
    CONSTRAINT chk_faza_ditet CHECK (ditet BETWEEN 1 AND 365)
);

COMMENT ON TABLE  profili_faza       IS 'Fazat fenologjike FAO-56 të profilit: 1 fillestare, 2 zhvillimi, 3 mesi, 4 fundi i sezonit';
COMMENT ON COLUMN profili_faza.ditet IS 'Kohëzgjatja e fazës në ditë (L1–L4)';

CREATE FUNCTION kontrollo_fazat_e_profilit() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
    pid   INTEGER := COALESCE(NEW.profili_id, OLD.profili_id);
    n     INTEGER;
    total INTEGER;
BEGIN
    SELECT count(*), COALESCE(sum(ditet), 0) INTO n, total FROM profili_faza WHERE profili_id = pid;
    IF n NOT IN (0, 4) THEN
        RAISE EXCEPTION 'Profili %: duhen 0 ose 4 faza, janë %', pid, n;
    END IF;
    IF total > 366 THEN
        RAISE EXCEPTION 'Profili %: fazat janë gjithsej % ditë (maksimumi 366)', pid, total;
    END IF;
    RETURN NULL;
END $$;

CREATE CONSTRAINT TRIGGER profili_faza_kontrollo
    AFTER INSERT OR UPDATE OR DELETE ON profili_faza
    DEFERRABLE INITIALLY DEFERRED
    FOR EACH ROW EXECUTE FUNCTION kontrollo_fazat_e_profilit();

INSERT INTO profili_faza (profili_id, nr, ditet)
SELECT p.id, f.nr, f.ditet
  FROM (VALUES
    ('AL-CROP-000001', 20, 60, 110, 50),
    ('AL-CROP-000002', 20, 50, 100, 50),
    ('AL-CROP-000003', 20, 35, 55, 30),
    ('AL-CROP-000004', 15, 30, 45, 20),
    ('AL-CROP-000005', 30, 30, 60, 30),
    ('AL-CROP-000006', 20, 50, 90, 40),
    ('AL-CROP-000007', 20, 55, 105, 50),
    ('AL-CROP-000008', 15, 30, 50, 25),
    ('AL-CROP-000009', 25, 30, 40, 25),
    ('AL-CROP-000010', 20, 35, 55, 30),
    ('AL-CROP-000011', 30, 35, 55, 30),
    ('AL-CROP-000012', 30, 45, 120, 45),
    ('AL-CROP-000013', 30, 35, 55, 30),
    ('AL-CROP-000014', 20, 25, 35, 20),
    ('AL-CROP-000015', 20, 35, 65, 30),
    ('AL-CROP-000016', 20, 25, 40, 25),
    ('AL-CROP-000017', 20, 25, 40, 25),
    ('AL-CROP-000018', 25, 35, 65, 35),
    ('AL-CROP-000020', 30, 50, 110, 50),
    ('AL-CROP-000021', 20, 25, 40, 25),
    ('AL-CROP-000022', 20, 25, 35, 20),
    ('AL-CROP-000023', 25, 30, 40, 25),
    ('AL-CROP-000024', 20, 25, 35, 20),
    ('AL-CROP-000025', 25, 30, 40, 25),
    ('AL-CROP-000026', 15, 15, 20, 15),
    ('AL-CROP-000027', 15, 15, 25, 15),
    ('AL-CROP-000028', 20, 25, 35, 20),
    ('AL-CROP-000029', 15, 25, 40, 20),
    ('AL-CROP-000030', 20, 25, 40, 25),
    ('AL-CROP-000031', 15, 25, 40, 20),
    ('AL-CROP-000032', 20, 30, 45, 25),
    ('AL-CROP-000033', 25, 35, 50, 30),
    ('AL-CROP-000034', 20, 30, 45, 25),
    ('AL-CROP-000035', 15, 20, 35, 20),
    ('AL-CROP-000036', 30, 40, 70, 40),
    ('AL-CROP-000041', 30, 45, 65, 40),
    ('AL-CROP-000042', 25, 40, 60, 35),
    ('AL-CROP-000043', 25, 40, 60, 35),
    ('AL-CROP-000044', 30, 45, 65, 40),
    ('AL-CROP-000045', 30, 45, 65, 40),
    ('AL-CROP-000046', 25, 40, 60, 35),
    ('AL-CROP-000047', 30, 50, 85, 45),
    ('AL-CROP-000048', 30, 50, 85, 45),
    ('AL-CROP-000049', 30, 45, 75, 40),
    ('AL-CROP-000051', 30, 45, 65, 40),
    ('AL-CROP-000052', 30, 45, 65, 40),
    ('AL-CROP-000053', 30, 45, 75, 40),
    ('AL-CROP-000054', 30, 50, 85, 45),
    ('AL-CROP-000055', 25, 45, 70, 40),
    ('AL-CROP-000056', 25, 45, 70, 40),
    ('AL-CROP-000057', 25, 45, 70, 40),
    ('AL-CROP-000058', 40, 60, 100, 40),
    ('AL-CROP-000059', 40, 60, 100, 40),
    ('AL-CROP-000060', 40, 60, 100, 40),
    ('AL-CROP-000061', 40, 60, 100, 40),
    ('AL-CROP-000062', 40, 60, 100, 40),
    ('AL-CROP-000063', 40, 60, 100, 40),
    ('AL-CROP-000064', 30, 45, 65, 40),
    ('AL-CROP-000065', 30, 45, 65, 40),
    ('AL-CROP-000066', 30, 50, 85, 45),
    ('AL-CROP-000068', 30, 60, 180, 95),
    ('AL-CROP-000069', 25, 40, 75, 40),
    ('AL-CROP-000070', 30, 60, 180, 95),
    ('AL-CROP-000071', 30, 60, 180, 95),
    ('AL-CROP-000072', 20, 40, 80, 40),
    ('AL-CROP-000073', 30, 60, 180, 95),
    ('AL-CROP-000074', 30, 60, 180, 95),
    ('AL-CROP-000075', 20, 30, 50, 30),
    ('AL-CROP-000076', 20, 30, 55, 30),
    ('AL-CROP-000077', 20, 30, 60, 30),
    ('AL-CROP-000078', 25, 50, 115, 50),
    ('AL-CROP-000079', 15, 25, 50, 30),
    ('AL-CROP-000081', 25, 40, 75, 40),
    ('AL-CROP-000083', 40, 60, 100, 40),
    ('AL-CROP-000084', 40, 60, 100, 40),
    ('AL-CROP-000085', 40, 60, 100, 40),
    ('AL-CROP-000086', 25, 35, 80, 40),
    ('AL-CROP-000087', 40, 60, 100, 40),
    ('AL-CROP-000088', 40, 60, 100, 40),
    ('AL-CROP-000089', 15, 25, 40, 20),
    ('AL-CROP-000090', 20, 25, 35, 20),
    ('AL-CROP-000091', 15, 20, 35, 20),
    ('AL-CROP-000092', 20, 30, 45, 25),
    ('AL-CROP-000093', 20, 30, 45, 25),
    ('AL-CROP-000094', 15, 25, 45, 25),
    ('AL-CROP-000095', 25, 35, 50, 30),
    ('AL-CROP-000096', 40, 60, 100, 40),
    ('AL-CROP-000097', 20, 45, 75, 40),
    ('AL-CROP-000098', 15, 25, 40, 20),
    ('AL-CROP-000103', 30, 50, 110, 50),
    ('AL-CROP-000104', 30, 50, 110, 50),
    ('AL-CROP-000105', 10, 10, 15, 10),
    ('AL-CROP-000106', 10, 10, 12, 8),
    ('AL-CROP-000107', 25, 35, 60, 30),
    ('AL-CROP-000108', 25, 35, 50, 30)
       ) AS v (kodi, l1, l2, l3, l4)
  JOIN profili_kultures p ON p.kodi = v.kodi
  JOIN zona_agroklimatike z ON z.id = p.zona_id AND z.kodi = 'Z1'
 CROSS JOIN LATERAL (VALUES (1, v.l1), (2, v.l2), (3, v.l3), (4, v.l4)) AS f (nr, ditet);


CREATE VIEW v_profili_kultures AS
SELECT p.*, f.l1, f.l2, f.l3, f.l4, f.l1 + f.l2 + f.l3 + f.l4 AS tco
  FROM profili_kultures p
  LEFT JOIN (SELECT profili_id,
                    max(ditet) FILTER (WHERE nr = 1) AS l1,
                    max(ditet) FILTER (WHERE nr = 2) AS l2,
                    max(ditet) FILTER (WHERE nr = 3) AS l3,
                    max(ditet) FILTER (WHERE nr = 4) AS l4
               FROM profili_faza GROUP BY profili_id) f ON f.profili_id = p.id;

COMMENT ON VIEW v_profili_kultures IS 'Profili i kulturës me fazat L1–L4 dhe TCo = L1+L2+L3+L4';


CREATE FUNCTION etc_mujore(p_profili INTEGER)
RETURNS TABLE (muaji SMALLINT, ditet INTEGER, etc_mm NUMERIC)
LANGUAGE sql STABLE AS $$
    WITH p AS (
        SELECT * FROM v_profili_kultures
         WHERE id = p_profili AND tco IS NOT NULL AND muaji_mbjelljes IS NOT NULL
           AND kc_ini IS NOT NULL AND kc_mid IS NOT NULL AND kc_end IS NOT NULL
    ), d AS (
        SELECT p.zona_id, g.dita,
               (DATE '2001-01-01' + ((make_date(2001, p.muaji_mbjelljes, 1) - DATE '2001-01-01') + g.dita) % 365) AS data,
               CASE
                   WHEN g.dita < p.l1 THEN p.kc_ini
                   WHEN g.dita < p.l1 + p.l2 THEN p.kc_ini + (p.kc_mid - p.kc_ini) * (g.dita + 1 - p.l1)::numeric / p.l2
                   WHEN g.dita < p.l1 + p.l2 + p.l3 THEN p.kc_mid
                   ELSE p.kc_mid + (p.kc_end - p.kc_mid) * (g.dita + 1 - p.l1 - p.l2 - p.l3)::numeric / p.l4
               END AS kc
          FROM p CROSS JOIN generate_series(0, p.tco - 1) AS g (dita)
    )
    SELECT extract(month FROM d.data)::smallint, count(*)::integer, round(sum(d.kc * c.eto_mm_dite) + 0.000000001, 1)
      FROM d JOIN klima_mujore c ON c.zona_id = d.zona_id AND c.muaji = extract(month FROM d.data)
     GROUP BY 1
     ORDER BY 1;
$$;

COMMENT ON FUNCTION etc_mujore(INTEGER) IS 'ETc mujore (mm) e profilit: ET₀ × Kc ditë për ditë, e mbledhur sipas muajit';


CREATE TABLE parametrat_historiku (
    id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tabela         VARCHAR(30) NOT NULL,
    rreshti        VARCHAR(30) NOT NULL,
    para           JSONB       NOT NULL,
    pas            JSONB       NOT NULL,
    arsyeja        TEXT        NOT NULL,
    perdoruesi_id  BIGINT      NOT NULL,
    ndryshuar_me   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_ph_perdoruesi FOREIGN KEY (perdoruesi_id)
        REFERENCES perdoruesi (id) ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT chk_ph_tabela   CHECK (tabela IN ('profili_kultures', 'klima_mujore')),
    CONSTRAINT chk_ph_arsyeja  CHECK (btrim(arsyeja) <> ''),
    CONSTRAINT chk_ph_ndryshon CHECK (para <> pas)
);

CREATE INDEX idx_ph_rreshti ON parametrat_historiku (tabela, rreshti, ndryshuar_me);

COMMENT ON TABLE  parametrat_historiku         IS 'Historiku i ndryshimeve të parametrave agronomikë dhe klimatikë';
COMMENT ON COLUMN parametrat_historiku.rreshti IS 'profili_kultures: id e profilit; klima_mujore: kodi i zonës dhe muaji, p.sh. Z1-7';
COMMENT ON COLUMN parametrat_historiku.para    IS 'Vlerat e fushave të ndryshuara, para ndryshimit';
COMMENT ON COLUMN parametrat_historiku.pas     IS 'Vlerat e fushave të ndryshuara, pas ndryshimit';
COMMENT ON COLUMN parametrat_historiku.arsyeja IS 'Arsyeja e ndryshimit (e detyrueshme)';


DO $$
BEGIN
    IF (SELECT count(*) FROM klima_mujore) <> 48 THEN
        RAISE EXCEPTION 'ET₀: pritej 48 rreshta (4 zona × 12 muaj)';
    END IF;
    IF (SELECT count(*) FROM profili_kultures) <> 118 THEN
        RAISE EXCEPTION 'Zona 1: pritej 118 profile, janë %', (SELECT count(*) FROM profili_kultures);
    END IF;
    IF (SELECT count(*) FROM profili_kultures WHERE kultura_id IS NOT NULL) <> 70 THEN
        RAISE EXCEPTION 'Lidhje me katalogun: pritej 70';
    END IF;
    IF (SELECT count(DISTINCT profili_id) FROM profili_faza) <> 95 OR (SELECT count(*) FROM profili_faza) <> 4 * 95 THEN
        RAISE EXCEPTION 'Fazat: pritej 95 profile me nga 4 faza';
    END IF;
END $$;

GRANT SELECT ON klima_mujore, profili_kultures, profili_faza, v_profili_kultures, parametrat_historiku TO idmis_app;
GRANT UPDATE (kc_ini, kc_mid, kc_end, muaji_mbjelljes) ON profili_kultures TO idmis_app;
GRANT INSERT, DELETE, UPDATE (ditet) ON profili_faza TO idmis_app;
GRANT UPDATE (eto_mm_dite) ON klima_mujore TO idmis_app;
GRANT INSERT ON parametrat_historiku TO idmis_app;
GRANT EXECUTE ON FUNCTION etc_mujore(INTEGER) TO idmis_app;

COMMIT;
