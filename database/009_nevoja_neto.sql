BEGIN;

CREATE FUNCTION nevoja_neto_mujore(p_profili INTEGER)
RETURNS TABLE (muaji SMALLINT, ditet INTEGER, etc_mm NUMERIC, reshjet_mm NUMERIC, neto_mm NUMERIC)
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
    ), e AS (
        SELECT extract(month FROM d.data)::smallint AS muaji,
               d.kc * c.eto_mm_dite AS etc,
               coalesce(c.reshjet_efektive_mm, 0)
                 / extract(day FROM date_trunc('month', d.data) + INTERVAL '1 month - 1 day') AS pe
          FROM d JOIN klima_mujore c ON c.zona_id = d.zona_id AND c.muaji = extract(month FROM d.data)
    )
    SELECT e.muaji, count(*)::integer,
           round(sum(e.etc) + 0.000000001, 1),
           round(sum(e.pe) + 0.000000001, 1),
           round(sum(greatest(0, e.etc - e.pe)) + 0.000000001, 1)
      FROM e
     GROUP BY 1
     ORDER BY 1;
$$;

COMMENT ON FUNCTION nevoja_neto_mujore(INTEGER) IS 'Nevoja neto mujore (mm) e profilit: max(0, ET₀ × Kc − Pe) ditë për ditë, e mbledhur sipas muajit';

GRANT EXECUTE ON FUNCTION nevoja_neto_mujore(INTEGER) TO idmis_app;
GRANT UPDATE (reshjet_efektive_mm) ON klima_mujore TO idmis_app;

COMMIT;
