BEGIN;

CREATE TABLE grupi_kultures (
    id             SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    kodi           VARCHAR(12)  NOT NULL,
    emri           VARCHAR(120) NOT NULL,
    statusi        VARCHAR(10)  NOT NULL DEFAULT 'draft',
    krijuar_me     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    perditesuar_me TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_grupi_kultures_kodi UNIQUE (kodi),
    CONSTRAINT uq_grupi_kultures_emri UNIQUE (emri),
    CONSTRAINT chk_grupi_kultures_kodi CHECK (kodi ~ '^AL-GCROP-[0-9]{3}$'),
    CONSTRAINT chk_grupi_kultures_emri CHECK (emri = btrim(emri) AND emri <> ''),
    CONSTRAINT chk_grupi_kultures_statusi CHECK (statusi IN ('draft', 'aprovuar', 'jo_aktiv'))
);

COMMENT ON TABLE  grupi_kultures         IS 'Grupet kryesore të kulturave në katalogun kombëtar të IDMIS';
COMMENT ON COLUMN grupi_kultures.kodi    IS 'Kodi unik kombëtar: AL-GCROP-001 … (crop_group_code)';
COMMENT ON COLUMN grupi_kultures.emri    IS 'Grupi kryesor i kulturës (crop_group)';
COMMENT ON COLUMN grupi_kultures.statusi IS 'Statusi i regjistrimit në katalog: draft, aprovuar, jo_aktiv';

CREATE TRIGGER grupi_kultures_perditesuar_me
    BEFORE UPDATE ON grupi_kultures
    FOR EACH ROW EXECUTE FUNCTION vendos_perditesuar_me();

INSERT INTO grupi_kultures (kodi, emri, statusi) VALUES
    ('AL-GCROP-001', 'Drithërat dhe kulturat e ngjashme',                'draft'),
    ('AL-GCROP-002', 'Bishtajoret',                                      'draft'),
    ('AL-GCROP-003', 'Perimet gjethore dhe kërcellore',                  'draft'),
    ('AL-GCROP-004', 'Perimet frutore',                                  'draft'),
    ('AL-GCROP-005', 'Perimet rrënjore, bulbot dhe zhardhokët',          'draft'),
    ('AL-GCROP-006', 'Kulturat foragjere dhe kullotat e kultivuara',     'draft'),
    ('AL-GCROP-007', 'Kulturat vajore, industriale dhe të tjera',        'draft'),
    ('AL-GCROP-008', 'Pemët frutore',                                    'draft'),
    ('AL-GCROP-009', 'Agrumet',                                          'draft'),
    ('AL-GCROP-010', 'Ulliri, rrushi dhe arrorët',                       'draft'),
    ('AL-GCROP-011', 'Bimët aromatike, mjekësore dhe erëzat',            'draft'),
    ('AL-GCROP-012', 'Fidanë dhe materiale mbjellëse',                   'draft');


CREATE TABLE kultura (
    id             INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    kodi           VARCHAR(14)  NOT NULL,
    emri           VARCHAR(120) NOT NULL,
    emri_en        VARCHAR(120),
    emri_shkencor  VARCHAR(150),
    grupi_id       SMALLINT     NOT NULL,
    lloji          VARCHAR(20),
    cpa_kodi       VARCHAR(5),
    statusi        VARCHAR(10)  NOT NULL DEFAULT 'draft',
    krijuar_me     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    perditesuar_me TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_kultura_kodi UNIQUE (kodi),
    CONSTRAINT uq_kultura_emri UNIQUE (emri),
    CONSTRAINT fk_kultura_grupi FOREIGN KEY (grupi_id)
        REFERENCES grupi_kultures (id) ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT chk_kultura_kodi CHECK (kodi ~ '^AL-CROP-[0-9]{6}$'),
    CONSTRAINT chk_kultura_emri CHECK (emri = btrim(emri) AND emri <> ''),
    CONSTRAINT chk_kultura_emri_en CHECK (emri_en = btrim(emri_en) AND emri_en <> ''),
    CONSTRAINT chk_kultura_emri_shkencor CHECK (emri_shkencor = btrim(emri_shkencor) AND emri_shkencor <> ''),
    CONSTRAINT chk_kultura_lloji CHECK (lloji IN (
        'Njëvjeçare', 'Shumëvjeçare', 'Një/Shumëvjeçare', 'E përhershme', 'E ndryshueshme')),
    CONSTRAINT chk_kultura_cpa_kodi CHECK (cpa_kodi ~ '^[0-9]{2}\.[0-9]{2}$'),
    CONSTRAINT chk_kultura_statusi CHECK (statusi IN ('draft', 'aprovuar', 'jo_aktiv'))
);

CREATE INDEX idx_kultura_grupi ON kultura (grupi_id);

COMMENT ON TABLE  kultura               IS 'Katalogu kombëtar i kulturave bujqësore të IDMIS';
COMMENT ON COLUMN kultura.kodi          IS 'Kodi unik kombëtar: AL-CROP-000001 … (crop_code); blloqe me 100 kode për çdo grup';
COMMENT ON COLUMN kultura.emri          IS 'Emri i kulturës në shqip (crop_name_sq)';
COMMENT ON COLUMN kultura.emri_en       IS 'Emri i kulturës në anglisht (crop_name_en); bosh në Excel';
COMMENT ON COLUMN kultura.emri_shkencor IS 'Emri botanik (scientific_name); NULL = i panjohur';
COMMENT ON COLUMN kultura.grupi_id      IS 'Grupi kryesor i kulturës (crop_group)';
COMMENT ON COLUMN kultura.lloji         IS 'Njëvjeçare, shumëvjeçare, … (crop_type); NULL = për verifikim';
COMMENT ON COLUMN kultura.cpa_kodi      IS 'Kategoria CPA 2008 e INSTAT, p.sh. 01.11 (cpa_mapping); NULL = për verifikim';
COMMENT ON COLUMN kultura.statusi       IS 'Statusi i regjistrimit në katalog: draft, aprovuar, jo_aktiv';

CREATE TRIGGER kultura_perditesuar_me
    BEFORE UPDATE ON kultura
    FOR EACH ROW EXECUTE FUNCTION vendos_perditesuar_me();

INSERT INTO kultura (kodi, emri, emri_shkencor, grupi_id, lloji, cpa_kodi, statusi)
SELECT v.kodi, v.emri, v.emri_shkencor, g.id, v.lloji, v.cpa_kodi, v.statusi
  FROM (VALUES
    ('AL-CROP-000001', 'Grurë',                      'Triticum aestivum',                'Drithërat dhe kulturat e ngjashme',              'Njëvjeçare',       '01.11', 'draft'),
    ('AL-CROP-000002', 'Misër për kokërr',           'Zea mays',                         'Drithërat dhe kulturat e ngjashme',              'Njëvjeçare',       '01.11', 'draft'),
    ('AL-CROP-000003', 'Misër për silazh',           'Zea mays',                         'Drithërat dhe kulturat e ngjashme',              'Njëvjeçare',       '01.19', 'draft'),
    ('AL-CROP-000004', 'Elb',                        'Hordeum vulgare',                  'Drithërat dhe kulturat e ngjashme',              'Njëvjeçare',       '01.11', 'draft'),
    ('AL-CROP-000005', 'Thekër',                     'Secale cereale',                   'Drithërat dhe kulturat e ngjashme',              'Njëvjeçare',       '01.11', 'draft'),
    ('AL-CROP-000006', 'Tërshërë',                   'Avena sativa',                     'Drithërat dhe kulturat e ngjashme',              'Njëvjeçare',       '01.11', 'draft'),
    ('AL-CROP-000007', 'Oriz',                       'Oryza sativa',                     'Drithërat dhe kulturat e ngjashme',              'Njëvjeçare',       '01.12', 'draft'),
    ('AL-CROP-000008', 'Sorgum',                     'Sorghum bicolor',                  'Drithërat dhe kulturat e ngjashme',              'Njëvjeçare',       '01.11', 'draft'),
    ('AL-CROP-000009', 'Mel',                        'Panicum miliaceum',                'Drithërat dhe kulturat e ngjashme',              'Njëvjeçare',       '01.11', 'draft'),
    ('AL-CROP-000010', 'Hikërror',                   'Fagopyrum esculentum',             'Drithërat dhe kulturat e ngjashme',              'Njëvjeçare',       '01.11', 'draft'),
    ('AL-CROP-000101', 'Fasule e thatë',             'Phaseolus vulgaris',               'Bishtajoret',                                    'Njëvjeçare',       '01.11', 'draft'),
    ('AL-CROP-000102', 'Fasule e njomë',             'Phaseolus vulgaris',               'Bishtajoret',                                    'Njëvjeçare',       '01.11', 'draft'),
    ('AL-CROP-000103', 'Bizele e thatë',             'Pisum sativum',                    'Bishtajoret',                                    'Njëvjeçare',       '01.11', 'draft'),
    ('AL-CROP-000104', 'Bizele e njomë',             'Pisum sativum',                    'Bishtajoret',                                    'Njëvjeçare',       '01.11', 'draft'),
    ('AL-CROP-000105', 'Qiqra',                      'Cicer arietinum',                  'Bishtajoret',                                    'Njëvjeçare',       '01.11', 'draft'),
    ('AL-CROP-000106', 'Thjerrëza',                  'Lens culinaris',                   'Bishtajoret',                                    'Njëvjeçare',       '01.11', 'draft'),
    ('AL-CROP-000107', 'Bathë',                      'Vicia faba',                       'Bishtajoret',                                    'Njëvjeçare',       '01.11', 'draft'),
    ('AL-CROP-000108', 'Sojë',                       'Glycine max',                      'Bishtajoret',                                    'Njëvjeçare',       '01.11', 'draft'),
    ('AL-CROP-000109', 'Lakër jonxhë?',              NULL,                               'Bishtajoret',                                    NULL,               NULL,    'draft'),
    ('AL-CROP-000110', 'Lupin',                      'Lupinus spp.',                     'Bishtajoret',                                    'Njëvjeçare',       '01.11', 'draft'),
    ('AL-CROP-000201', 'Sallatë jeshile',            'Lactuca sativa',                   'Perimet gjethore dhe kërcellore',                'Njëvjeçare',       '01.13', 'draft'),
    ('AL-CROP-000202', 'Spinaq',                     'Spinacia oleracea',                'Perimet gjethore dhe kërcellore',                'Njëvjeçare',       '01.13', 'draft'),
    ('AL-CROP-000203', 'Lakër e bardhë',             'Brassica oleracea var. capitata',  'Perimet gjethore dhe kërcellore',                'Njëvjeçare',       '01.13', 'draft'),
    ('AL-CROP-000204', 'Lakër e kuqe',               'Brassica oleracea var. capitata',  'Perimet gjethore dhe kërcellore',                'Njëvjeçare',       '01.13', 'draft'),
    ('AL-CROP-000205', 'Lulelakër',                  'Brassica oleracea var. botrytis',  'Perimet gjethore dhe kërcellore',                'Njëvjeçare',       '01.13', 'draft'),
    ('AL-CROP-000206', 'Brokoli',                    'Brassica oleracea var. italica',   'Perimet gjethore dhe kërcellore',                'Njëvjeçare',       '01.13', 'draft'),
    ('AL-CROP-000207', 'Presh',                      'Allium ampeloprasum',              'Perimet gjethore dhe kërcellore',                'Njëvjeçare',       '01.13', 'draft'),
    ('AL-CROP-000208', 'Selino',                     'Apium graveolens',                 'Perimet gjethore dhe kërcellore',                'Njëvjeçare',       '01.13', 'draft'),
    ('AL-CROP-000209', 'Majdanoz për gjethe',        'Petroselinum crispum',             'Perimet gjethore dhe kërcellore',                'Njëvjeçare',       '01.13', 'draft'),
    ('AL-CROP-000210', 'Kopër për gjethe',           'Anethum graveolens',               'Perimet gjethore dhe kërcellore',                'Njëvjeçare',       '01.13', 'draft'),
    ('AL-CROP-000301', 'Domate',                     'Solanum lycopersicum',             'Perimet frutore',                                'Njëvjeçare',       '01.13', 'draft'),
    ('AL-CROP-000302', 'Spec',                       'Capsicum annuum',                  'Perimet frutore',                                'Njëvjeçare',       '01.13', 'draft'),
    ('AL-CROP-000303', 'Patëllxhan',                 'Solanum melongena',                'Perimet frutore',                                'Njëvjeçare',       '01.13', 'draft'),
    ('AL-CROP-000304', 'Kastravec',                  'Cucumis sativus',                  'Perimet frutore',                                'Njëvjeçare',       '01.13', 'draft'),
    ('AL-CROP-000305', 'Kungull i njomë',            'Cucurbita pepo',                   'Perimet frutore',                                'Njëvjeçare',       '01.13', 'draft'),
    ('AL-CROP-000306', 'Kungull dimëror',            'Cucurbita spp.',                   'Perimet frutore',                                'Njëvjeçare',       '01.13', 'draft'),
    ('AL-CROP-000307', 'Shalqi',                     'Citrullus lanatus',                'Perimet frutore',                                'Njëvjeçare',       '01.13', 'draft'),
    ('AL-CROP-000308', 'Pjepër',                     'Cucumis melo',                     'Perimet frutore',                                'Njëvjeçare',       '01.13', 'draft'),
    ('AL-CROP-000309', 'Bamje',                      'Abelmoschus esculentus',           'Perimet frutore',                                'Njëvjeçare',       '01.13', 'draft'),
    ('AL-CROP-000310', 'Misër i ëmbël',              'Zea mays var. saccharata',         'Perimet frutore',                                'Njëvjeçare',       '01.13', 'draft'),
    ('AL-CROP-000401', 'Patate',                     'Solanum tuberosum',                'Perimet rrënjore, bulbot dhe zhardhokët',        'Njëvjeçare',       '01.13', 'draft'),
    ('AL-CROP-000402', 'Patate e ëmbël',             'Ipomoea batatas',                  'Perimet rrënjore, bulbot dhe zhardhokët',        'Njëvjeçare',       '01.13', 'draft'),
    ('AL-CROP-000403', 'Qepë',                       'Allium cepa',                      'Perimet rrënjore, bulbot dhe zhardhokët',        'Njëvjeçare',       '01.13', 'draft'),
    ('AL-CROP-000404', 'Hudhër',                     'Allium sativum',                   'Perimet rrënjore, bulbot dhe zhardhokët',        'Njëvjeçare',       '01.13', 'draft'),
    ('AL-CROP-000405', 'Presh për prodhim tregtar',  'Allium ampeloprasum',              'Perimet rrënjore, bulbot dhe zhardhokët',        'Njëvjeçare',       '01.13', 'draft'),
    ('AL-CROP-000406', 'Karotë',                     'Daucus carota subsp. sativus',     'Perimet rrënjore, bulbot dhe zhardhokët',        'Njëvjeçare',       '01.13', 'draft'),
    ('AL-CROP-000407', 'Panxhar i kuq',              'Beta vulgaris',                    'Perimet rrënjore, bulbot dhe zhardhokët',        'Njëvjeçare',       '01.13', 'draft'),
    ('AL-CROP-000408', 'Rrepkë',                     'Raphanus sativus',                 'Perimet rrënjore, bulbot dhe zhardhokët',        'Njëvjeçare',       '01.13', 'draft'),
    ('AL-CROP-000409', 'Rrepë',                      'Brassica rapa',                    'Perimet rrënjore, bulbot dhe zhardhokët',        'Njëvjeçare',       '01.13', 'draft'),
    ('AL-CROP-000501', 'Jonxhë',                     'Medicago sativa',                  'Kulturat foragjere dhe kullotat e kultivuara',   'Shumëvjeçare',     '01.19', 'draft'),
    ('AL-CROP-000502', 'Tërfil i kuq',               'Trifolium pratense',               'Kulturat foragjere dhe kullotat e kultivuara',   'Shumëvjeçare',     '01.19', 'draft'),
    ('AL-CROP-000503', 'Tërfil i bardhë',            'Trifolium repens',                 'Kulturat foragjere dhe kullotat e kultivuara',   'Shumëvjeçare',     '01.19', 'draft'),
    ('AL-CROP-000504', 'Bar livadhesh i kultivuar',  'Përzierje speciesh',               'Kulturat foragjere dhe kullotat e kultivuara',   'Shumëvjeçare',     '01.19', 'draft'),
    ('AL-CROP-000505', 'Lolium / bar anglez',        'Lolium spp.',                      'Kulturat foragjere dhe kullotat e kultivuara',   'Një/Shumëvjeçare', '01.19', 'draft'),
    ('AL-CROP-000506', 'Festukë',                    'Festuca spp.',                     'Kulturat foragjere dhe kullotat e kultivuara',   'Shumëvjeçare',     '01.19', 'draft'),
    ('AL-CROP-000507', 'Sorgum foragjer',            'Sorghum bicolor',                  'Kulturat foragjere dhe kullotat e kultivuara',   'Njëvjeçare',       '01.19', 'draft'),
    ('AL-CROP-000508', 'Misër foragjer',             'Zea mays',                         'Kulturat foragjere dhe kullotat e kultivuara',   'Njëvjeçare',       '01.19', 'draft'),
    ('AL-CROP-000509', 'Vetch / bizelë foragjere',   'Vicia sativa',                     'Kulturat foragjere dhe kullotat e kultivuara',   'Njëvjeçare',       '01.19', 'draft'),
    ('AL-CROP-000510', 'Tërshërë foragjere',         'Avena sativa',                     'Kulturat foragjere dhe kullotat e kultivuara',   'Njëvjeçare',       '01.19', 'draft'),
    ('AL-CROP-000601', 'Luledielli',                 'Helianthus annuus',                'Kulturat vajore, industriale dhe të tjera',      'Njëvjeçare',       '01.11', 'draft'),
    ('AL-CROP-000602', 'Raps',                       'Brassica napus',                   'Kulturat vajore, industriale dhe të tjera',      'Njëvjeçare',       '01.11', 'draft'),
    ('AL-CROP-000603', 'Susam',                      'Sesamum indicum',                  'Kulturat vajore, industriale dhe të tjera',      'Njëvjeçare',       '01.11', 'draft'),
    ('AL-CROP-000604', 'Kikirik',                    'Arachis hypogaea',                 'Kulturat vajore, industriale dhe të tjera',      'Njëvjeçare',       '01.11', 'draft'),
    ('AL-CROP-000605', 'Liri',                       'Linum usitatissimum',              'Kulturat vajore, industriale dhe të tjera',      'Njëvjeçare',       '01.16', 'draft'),
    ('AL-CROP-000606', 'Pambuk',                     'Gossypium spp.',                   'Kulturat vajore, industriale dhe të tjera',      'Njëvjeçare',       '01.16', 'draft'),
    ('AL-CROP-000607', 'Duhan',                      'Nicotiana tabacum',                'Kulturat vajore, industriale dhe të tjera',      'Njëvjeçare',       '01.15', 'draft'),
    ('AL-CROP-000608', 'Panxhar sheqeri',            'Beta vulgaris var. altissima',     'Kulturat vajore, industriale dhe të tjera',      'Njëvjeçare',       '01.13', 'draft'),
    ('AL-CROP-000609', 'Bimë për farë perimesh',     'Sipas species',                    'Kulturat vajore, industriale dhe të tjera',      'Njëvjeçare',       '01.13', 'draft'),
    ('AL-CROP-000610', 'Lule të prera',              'Sipas species',                    'Kulturat vajore, industriale dhe të tjera',      'Njëvjeçare',       '01.19', 'draft'),
    ('AL-CROP-000701', 'Mollë',                      'Malus domestica',                  'Pemët frutore',                                  'Shumëvjeçare',     '01.24', 'draft'),
    ('AL-CROP-000702', 'Dardhë',                     'Pyrus communis',                   'Pemët frutore',                                  'Shumëvjeçare',     '01.24', 'draft'),
    ('AL-CROP-000703', 'Fto',                        'Cydonia oblonga',                  'Pemët frutore',                                  'Shumëvjeçare',     '01.24', 'draft'),
    ('AL-CROP-000704', 'Pjeshkë',                    'Prunus persica',                   'Pemët frutore',                                  'Shumëvjeçare',     '01.24', 'draft'),
    ('AL-CROP-000705', 'Nektarinë',                  'Prunus persica var. nucipersica',  'Pemët frutore',                                  'Shumëvjeçare',     '01.24', 'draft'),
    ('AL-CROP-000706', 'Kumbull',                    'Prunus domestica',                 'Pemët frutore',                                  'Shumëvjeçare',     '01.24', 'draft'),
    ('AL-CROP-000707', 'Kajsi',                      'Prunus armeniaca',                 'Pemët frutore',                                  'Shumëvjeçare',     '01.24', 'draft'),
    ('AL-CROP-000708', 'Qershi',                     'Prunus avium',                     'Pemët frutore',                                  'Shumëvjeçare',     '01.24', 'draft'),
    ('AL-CROP-000709', 'Vishnje',                    'Prunus cerasus',                   'Pemët frutore',                                  'Shumëvjeçare',     '01.24', 'draft'),
    ('AL-CROP-000710', 'Shegë',                      'Punica granatum',                  'Pemët frutore',                                  'Shumëvjeçare',     '01.25', 'draft'),
    ('AL-CROP-000711', 'Fik',                        'Ficus carica',                     'Pemët frutore',                                  'Shumëvjeçare',     '01.25', 'draft'),
    ('AL-CROP-000712', 'Hurma',                      'Diospyros kaki',                   'Pemët frutore',                                  'Shumëvjeçare',     '01.25', 'draft'),
    ('AL-CROP-000713', 'Kivi',                       'Actinidia deliciosa',              'Pemët frutore',                                  'Shumëvjeçare',     '01.25', 'draft'),
    ('AL-CROP-000714', 'Luleshtrydhe',               'Fragaria × ananassa',              'Pemët frutore',                                  'Shumëvjeçare',     '01.25', 'draft'),
    ('AL-CROP-000715', 'Mjedër',                     'Rubus idaeus',                     'Pemët frutore',                                  'Shumëvjeçare',     '01.25', 'draft'),
    ('AL-CROP-000716', 'Manaferra',                  'Rubus fruticosus agg.',            'Pemët frutore',                                  'Shumëvjeçare',     '01.25', 'draft'),
    ('AL-CROP-000801', 'Portokall',                  'Citrus sinensis',                  'Agrumet',                                        'Shumëvjeçare',     '01.23', 'draft'),
    ('AL-CROP-000802', 'Mandarina',                  'Citrus reticulata',                'Agrumet',                                        'Shumëvjeçare',     '01.23', 'draft'),
    ('AL-CROP-000803', 'Limon',                      'Citrus limon',                     'Agrumet',                                        'Shumëvjeçare',     '01.23', 'draft'),
    ('AL-CROP-000804', 'Grejpfrut',                  'Citrus × paradisi',                'Agrumet',                                        'Shumëvjeçare',     '01.23', 'draft'),
    ('AL-CROP-000805', 'Agrume të tjera',            'Citrus spp.',                      'Agrumet',                                        'Shumëvjeçare',     '01.23', 'draft'),
    ('AL-CROP-000901', 'Ullinj për vaj',             'Olea europaea',                    'Ulliri, rrushi dhe arrorët',                     'Shumëvjeçare',     '01.26', 'draft'),
    ('AL-CROP-000902', 'Ullinj për tavolinë',        'Olea europaea',                    'Ulliri, rrushi dhe arrorët',                     'Shumëvjeçare',     '01.26', 'draft'),
    ('AL-CROP-000903', 'Rrush për verë',             'Vitis vinifera',                   'Ulliri, rrushi dhe arrorët',                     'Shumëvjeçare',     '01.21', 'draft'),
    ('AL-CROP-000904', 'Rrush i freskët',            'Vitis vinifera',                   'Ulliri, rrushi dhe arrorët',                     'Shumëvjeçare',     '01.21', 'draft'),
    ('AL-CROP-000905', 'Rrush i thatë',              'Vitis vinifera',                   'Ulliri, rrushi dhe arrorët',                     'Shumëvjeçare',     '01.21', 'draft'),
    ('AL-CROP-000906', 'Arrë',                       'Juglans regia',                    'Ulliri, rrushi dhe arrorët',                     'Shumëvjeçare',     '01.25', 'draft'),
    ('AL-CROP-000907', 'Bajame',                     'Prunus dulcis',                    'Ulliri, rrushi dhe arrorët',                     'Shumëvjeçare',     '01.25', 'draft'),
    ('AL-CROP-000908', 'Lajthi',                     'Corylus avellana',                 'Ulliri, rrushi dhe arrorët',                     'Shumëvjeçare',     '01.25', 'draft'),
    ('AL-CROP-000909', 'Gështenjë',                  'Castanea sativa',                  'Ulliri, rrushi dhe arrorët',                     'Shumëvjeçare',     '01.25', 'draft'),
    ('AL-CROP-000910', 'Fistik',                     'Pistacia vera',                    'Ulliri, rrushi dhe arrorët',                     'Shumëvjeçare',     '01.25', 'draft'),
    ('AL-CROP-001001', 'Sherebelë',                  'Salvia officinalis',               'Bimët aromatike, mjekësore dhe erëzat',          'Shumëvjeçare',     '01.28', 'draft'),
    ('AL-CROP-001002', 'Rozmarinë',                  'Salvia rosmarinus',                'Bimët aromatike, mjekësore dhe erëzat',          'Shumëvjeçare',     '01.28', 'draft'),
    ('AL-CROP-001003', 'Lavandë',                    'Lavandula spp.',                   'Bimët aromatike, mjekësore dhe erëzat',          'Shumëvjeçare',     '01.28', 'draft'),
    ('AL-CROP-001004', 'Rigoni',                     'Origanum vulgare',                 'Bimët aromatike, mjekësore dhe erëzat',          'Shumëvjeçare',     '01.28', 'draft'),
    ('AL-CROP-001005', 'Trumzë',                     'Thymus vulgaris',                  'Bimët aromatike, mjekësore dhe erëzat',          'Shumëvjeçare',     '01.28', 'draft'),
    ('AL-CROP-001006', 'Mente',                      'Mentha spp.',                      'Bimët aromatike, mjekësore dhe erëzat',          'Shumëvjeçare',     '01.28', 'draft'),
    ('AL-CROP-001007', 'Borzilok',                   'Ocimum basilicum',                 'Bimët aromatike, mjekësore dhe erëzat',          'Njëvjeçare',       '01.28', 'draft'),
    ('AL-CROP-001008', 'Koriandër për farë',         'Coriandrum sativum',               'Bimët aromatike, mjekësore dhe erëzat',          'Njëvjeçare',       '01.28', 'draft'),
    ('AL-CROP-001009', 'Kamomil',                    'Matricaria chamomilla',            'Bimët aromatike, mjekësore dhe erëzat',          'Njëvjeçare',       '01.28', 'draft'),
    ('AL-CROP-001010', 'Lule e pavdekshme',          'Helichrysum italicum',             'Bimët aromatike, mjekësore dhe erëzat',          'Shumëvjeçare',     '01.28', 'draft'),
    ('AL-CROP-001011', 'Bimë mjekësore të tjera',    'Others',                           'Bimët aromatike, mjekësore dhe erëzat',          'E ndryshueshme',   '01.28', 'draft'),
    ('AL-CROP-001101', 'Fidanishte pemësh frutore',  'Sipas species',                    'Fidanë dhe materiale mbjellëse',                 'Shumëvjeçare',     '01.30', 'draft'),
    ('AL-CROP-001102', 'Fidanë agrumesh',            'Citrus spp.',                      'Fidanë dhe materiale mbjellëse',                 'Shumëvjeçare',     '01.30', 'draft'),
    ('AL-CROP-001103', 'Fidanë ulliri',              'Olea europaea',                    'Fidanë dhe materiale mbjellëse',                 'Shumëvjeçare',     '01.30', 'draft'),
    ('AL-CROP-001104', 'Fidanë hardhie',             'Vitis vinifera',                   'Fidanë dhe materiale mbjellëse',                 'Shumëvjeçare',     '01.30', 'draft'),
    ('AL-CROP-001105', 'Fidanë perimesh',            'Sipas species',                    'Fidanë dhe materiale mbjellëse',                 'Njëvjeçare',       '01.30', 'draft'),
    ('AL-CROP-001106', 'Material mbjellës',          'Sipas species',                    'Fidanë dhe materiale mbjellëse',                 'E ndryshueshme',   '01.30', 'draft')
       ) AS v (kodi, emri, emri_shkencor, grupi, lloji, cpa_kodi, statusi)
  JOIN grupi_kultures g ON g.emri = v.grupi;

DO $$
BEGIN
    IF (SELECT count(*) FROM grupi_kultures) <> 12 THEN
        RAISE EXCEPTION 'Grupet: pritej 12, janë %', (SELECT count(*) FROM grupi_kultures);
    END IF;
    IF (SELECT count(*) FROM kultura) <> 117 THEN
        RAISE EXCEPTION 'Kulturat: pritej 117, janë %', (SELECT count(*) FROM kultura);
    END IF;
    IF EXISTS (SELECT 1 FROM kultura k JOIN grupi_kultures g ON g.id = k.grupi_id
                WHERE substr(k.kodi, 9, 4)::int + 1 <> substr(g.kodi, 10, 3)::int) THEN
        RAISE EXCEPTION 'Kultura jashtë bllokut të grupit: %',
            (SELECT string_agg(k.kodi || ' → ' || g.kodi, ', ') FROM kultura k JOIN grupi_kultures g ON g.id = k.grupi_id
              WHERE substr(k.kodi, 9, 4)::int + 1 <> substr(g.kodi, 10, 3)::int);
    END IF;
END $$;

GRANT SELECT ON grupi_kultures TO idmis_app;
GRANT SELECT ON kultura        TO idmis_app;

COMMIT;
