BEGIN;

CREATE OR REPLACE FUNCTION vendos_perditesuar_me() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
    IF (to_jsonb(NEW) - 'perditesuar_me' - 'hyrja_e_fundit')
     = (to_jsonb(OLD) - 'perditesuar_me' - 'hyrja_e_fundit') THEN
        NEW.perditesuar_me := OLD.perditesuar_me;
    ELSE
        NEW.perditesuar_me := NOW();
    END IF;
    RETURN NEW;
END $$;

GRANT CONNECT ON DATABASE idmis TO idmis_app;
GRANT USAGE   ON SCHEMA public TO idmis_app;
GRANT SELECT  ON bashkia        TO idmis_app;
GRANT SELECT  ON perdoruesi     TO idmis_app;
GRANT UPDATE (hyrja_e_fundit) ON perdoruesi TO idmis_app;

COMMIT;
