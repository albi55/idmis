BEGIN;

CREATE TABLE zona_agroklimatike (
    id             SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    kodi           VARCHAR(5)   NOT NULL,
    emri           VARCHAR(120) NOT NULL,
    zyrtare        BOOLEAN      NOT NULL DEFAULT FALSE,
    krijuar_me     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    perditesuar_me TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_zona_kodi UNIQUE (kodi),
    CONSTRAINT uq_zona_emri UNIQUE (emri),
    CONSTRAINT chk_zona_kodi CHECK (kodi ~ '^Z[0-9]+$'),
    CONSTRAINT chk_zona_emri CHECK (emri = btrim(emri) AND emri <> '')
);

COMMENT ON TABLE  zona_agroklimatike         IS 'Zonat agroklimatike të punës për llogaritjen e nevojave për ujitje';
COMMENT ON COLUMN zona_agroklimatike.kodi    IS 'Kodi i zonës: Z1–Z4 (si në Book2.xlsx)';
COMMENT ON COLUMN zona_agroklimatike.zyrtare IS 'FALSE = zonë pune paraprake, e paverifikuar agroklimatikisht';

CREATE TRIGGER zona_agroklimatike_perditesuar_me
    BEFORE UPDATE ON zona_agroklimatike
    FOR EACH ROW EXECUTE FUNCTION vendos_perditesuar_me();

INSERT INTO zona_agroklimatike (kodi, emri) VALUES
    ('Z1', 'Zona bregdetare dhe Ultësira Perëndimore'),
    ('Z2', 'Zona qendrore dhe kodrinore'),
    ('Z3', 'Zona jugore dhe jugperëndimore'),
    ('Z4', 'Zona verilindore dhe malore');


ALTER TABLE njesia_administrative ADD COLUMN zona_id SMALLINT;

UPDATE njesia_administrative n
   SET zona_id = z.id
  FROM (VALUES
    ( 45,1), ( 46,1), ( 47,1), ( 48,1), ( 49,1), ( 50,1), ( 51,1), ( 52,1), ( 53,1), ( 54,1), ( 78,1), ( 79,1), ( 80,1), ( 81,1),
    ( 82,1), ( 83,1), ( 84,1), ( 85,1), ( 86,1), ( 87,1), ( 88,1), ( 89,1), ( 90,1), ( 91,1), ( 92,1), ( 93,1), ( 94,1), (122,1),
    (123,1), (124,1), (125,1), (126,1), (127,1), (128,1), (129,1), (130,1), (131,1), (180,1), (181,1), (182,1), (183,1), (184,1),
    (185,1), (186,1), (187,1), (188,1), (189,1), (190,1), (191,1), (192,1), (193,1), (205,1), (206,1), (207,1), (208,1), (209,1),
    (210,1), (211,1), (212,1), (213,1), (214,1), (215,1), (216,1), (217,1), (218,1), (219,1), (220,1), (307,1), (308,1), (309,1),
    (310,1), (311,1), (312,1), (313,1), (314,1), (315,1), (316,1), (317,1), (318,1), (319,1), (320,1), (321,1), (322,1), (324,1),
    (336,1), (339,1), (342,1), (345,1), (350,1),
    (  1,2), (  2,2), (  3,2), (  4,2), (  5,2), (  6,2), (  7,2), (  8,2), (  9,2), ( 10,2), ( 11,2), ( 12,2), ( 25,2), ( 26,2),
    ( 27,2), ( 28,2), ( 29,2), ( 55,2), ( 56,2), ( 57,2), ( 58,2), ( 59,2), ( 60,2), ( 61,2), ( 62,2), ( 63,2), ( 64,2), ( 65,2),
    ( 66,2), ( 67,2), ( 68,2), ( 69,2), ( 70,2), ( 71,2), ( 72,2), ( 73,2), ( 74,2), ( 75,2), ( 76,2), ( 77,2), ( 95,2), ( 96,2),
    ( 97,2), ( 98,2), ( 99,2), (100,2), (101,2), (102,2), (103,2), (104,2), (140,2), (141,2), (142,2), (143,2), (144,2), (146,2),
    (147,2), (148,2), (149,2), (150,2), (151,2), (152,2), (153,2), (154,2), (155,2), (156,2), (157,2), (158,2), (159,2), (160,2),
    (161,2), (162,2), (163,2), (164,2), (198,2), (201,2), (203,2), (204,2), (255,2), (256,2), (257,2), (258,2), (259,2), (260,2),
    (270,2), (271,2), (272,2), (273,2), (274,2), (275,2), (276,2), (277,2), (302,2), (335,2), (337,2), (338,2), (340,2), (341,2),
    (343,2), (344,2), (346,2), (347,2), (348,2), (349,2), (351,2), (352,2), (353,2),
    ( 21,3), ( 22,3), ( 23,3), ( 24,3), (105,3), (106,3), (107,3), (108,3), (109,3), (110,3), (111,3), (112,3), (113,3), (114,3),
    (115,3), (116,3), (117,3), (227,3), (228,3), (229,3), (230,3), (231,3), (232,3), (233,3), (234,3), (235,3), (261,3), (262,3),
    (263,3), (264,3), (265,3), (266,3), (267,3), (268,3), (269,3), (288,3), (289,3), (290,3), (291,3), (292,3), (293,3), (294,3),
    (295,3), (296,3), (325,3), (326,3), (327,3), (328,3), (329,3), (330,3), (331,3), (332,3), (333,3), (334,3), (362,3), (363,3),
    (364,3), (365,3), (366,3), (367,3), (368,3), (369,3), (370,3), (371,3), (372,3), (373,3), (374,3),
    ( 13,4), ( 14,4), ( 15,4), ( 16,4), ( 17,4), ( 18,4), ( 19,4), ( 20,4), ( 30,4), ( 31,4), ( 32,4), ( 33,4), ( 34,4), ( 35,4),
    ( 36,4), ( 37,4), ( 38,4), ( 39,4), ( 40,4), ( 41,4), ( 42,4), ( 43,4), ( 44,4), (118,4), (119,4), (120,4), (121,4), (132,4),
    (133,4), (134,4), (135,4), (136,4), (137,4), (138,4), (139,4), (145,4), (165,4), (166,4), (167,4), (168,4), (169,4), (170,4),
    (171,4), (172,4), (173,4), (174,4), (175,4), (176,4), (177,4), (178,4), (179,4), (194,4), (195,4), (196,4), (197,4), (199,4),
    (200,4), (202,4), (221,4), (222,4), (223,4), (224,4), (225,4), (226,4), (236,4), (237,4), (238,4), (239,4), (240,4), (241,4),
    (242,4), (243,4), (244,4), (245,4), (246,4), (247,4), (248,4), (249,4), (250,4), (251,4), (252,4), (253,4), (254,4), (278,4),
    (279,4), (280,4), (281,4), (282,4), (283,4), (284,4), (285,4), (286,4), (287,4), (297,4), (298,4), (299,4), (300,4), (301,4),
    (303,4), (304,4), (305,4), (306,4), (354,4), (355,4), (356,4), (357,4), (358,4), (359,4), (360,4), (361,4)
       ) AS v (njesia_kodi, zona_nr)
  JOIN zona_agroklimatike z ON z.kodi = 'Z' || v.zona_nr
 WHERE n.kodi = v.njesia_kodi;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM njesia_administrative WHERE zona_id IS NULL) THEN
        RAISE EXCEPTION 'Njësi pa zonë: %',
            (SELECT string_agg(kodi || ' ' || emri, ', ') FROM njesia_administrative WHERE zona_id IS NULL);
    END IF;
END $$;

ALTER TABLE njesia_administrative
    ALTER COLUMN zona_id SET NOT NULL,
    ADD CONSTRAINT fk_njesia_zona FOREIGN KEY (zona_id)
        REFERENCES zona_agroklimatike (id) ON UPDATE RESTRICT ON DELETE RESTRICT;

CREATE INDEX idx_njesia_zona ON njesia_administrative (zona_id);

COMMENT ON COLUMN njesia_administrative.zona_id IS 'Zona agroklimatike e njësisë';

GRANT SELECT ON zona_agroklimatike TO idmis_app;

COMMIT;
