// IDMIS desktop launcher.
// Starts the IDMIS database (PostgreSQL, port 5433) and the IDMIS server (server\server.js, with
// sign-in) and opens the sign-in page in an Edge/Chrome app window. The server serves the pages
// from the idms folder next to this exe and lets no /Account/ page open without signing in.
// The fixed port keeps the origin the same as before, so data saved in the browser survives.
// Closing the last IDMIS window stops the server; the database keeps running.

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Management;
using System.Net;
using System.Reflection;
using System.Threading;
using System.Windows.Forms;

[assembly: AssemblyTitle("IDMIS")]
[assembly: AssemblyProduct("IDMIS")]
[assembly: AssemblyDescription("Sistemi i Informacionit për Menaxhimin e Ujitjes dhe Kullimit")]
[assembly: AssemblyVersion("1.1.0.0")]

static class Launcher
{
    const int Port = 47821;
    const string PingPath = "/__idmis_ping";
    const string PingReply = "idmis-hyrje";      // the sign-in server; the old built-in server answered "idmis"
    const string StartPage = "Account/Login.html";

    static readonly string DataDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "IDMIS");
    static readonly string AppDir = AppDomain.CurrentDomain.BaseDirectory;
    static readonly string ServerDir = Path.Combine(AppDir, "backend");
    static readonly string PgBin = @"C:\Program Files\PostgreSQL\17\bin";
    static readonly string PgData = Path.Combine(DataDir, "pgdata");

    static Process serverProcess;

    static void Log(string msg)
    {
        try { File.AppendAllText(Path.Combine(DataDir, "launcher.log"), DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "  " + msg + "\r\n"); }
        catch { }
    }

    static void Fail(string msg)
    {
        Log("ERROR " + msg.Replace("\n", " "));
        MessageBox.Show(msg, "IDMIS", MessageBoxButtons.OK, MessageBoxIcon.Error);
    }

    [STAThread]
    static int Main()
    {
        Directory.CreateDirectory(DataDir);
        try { return Run(); }
        catch (Exception ex)
        {
            Log("FATAL " + ex);
            MessageBox.Show("IDMIS nuk u hap:\n" + ex.Message, "IDMIS", MessageBoxButtons.OK, MessageBoxIcon.Error);
            return 1;
        }
        finally { StopServer(); }
    }

    static int Run()
    {
        string url = "http://127.0.0.1:" + Port + "/" + StartPage;

        // Already running: open another window on it.
        string ping = Ping();
        if (ping == PingReply) { OpenWindow(url); return 0; }
        if (ping == "idmis")
        {
            Fail("Një version i vjetër i IDMIS është ende i hapur.\nMbyllni të gjitha dritaret e IDMIS dhe provoni përsëri.");
            return 1;
        }
        if (ping != null)
        {
            Fail("Porta " + Port + " është e zënë nga një program tjetër.\nMbyllni atë program dhe provoni përsëri.");
            return 1;
        }

        if (!StartDatabase()) return 1;
        if (!StartServer()) return 1;

        string profile = OpenWindow(url);
        if (profile != null)
        {
            // Dedicated profile => keep serving until no browser process uses it (last window closed).
            while (ProfileInUse(profile) && !serverProcess.HasExited) Thread.Sleep(2000);
            Log(serverProcess.HasExited ? "server stopped unexpectedly" : "window closed, exiting");
        }
        else
        {
            RunTrayFallback();
        }
        return 0;
    }

    // ---- Database and server ------------------------------------------------------------

    static int RunQuiet(string exe, string args)
    {
        using (Process p = Process.Start(new ProcessStartInfo(exe, args) { UseShellExecute = false, CreateNoWindow = true }))
        {
            p.WaitForExit();
            return p.ExitCode;
        }
    }

    static bool StartDatabase()
    {
        string pgCtl = Path.Combine(PgBin, "pg_ctl.exe");
        if (!File.Exists(pgCtl) || !Directory.Exists(PgData))
        {
            Fail("Databaza e IDMIS nuk u gjet.\nPritej PostgreSQL 17 në " + PgBin + "\ndhe të dhënat në " + PgData);
            return false;
        }
        if (RunQuiet(pgCtl, "status -D \"" + PgData + "\"") == 0) return true;

        Log("starting database");
        int code = RunQuiet(pgCtl, "start -w -t 60 -D \"" + PgData + "\" -l \"" + Path.Combine(DataDir, "pgdata.log") + "\"");
        if (code != 0)
        {
            Fail("Databaza e IDMIS nuk u ndez (kodi " + code + ").\nShihni " + Path.Combine(DataDir, "pgdata.log"));
            return false;
        }
        return true;
    }

    static string FindNode()
    {
        string path = Environment.GetEnvironmentVariable("PATH") ?? "";
        foreach (string dir in path.Split(';'))
        {
            try
            {
                string p = Path.Combine(dir.Trim().Trim('"'), "node.exe");
                if (dir.Trim().Length > 0 && File.Exists(p)) return p;
            }
            catch (ArgumentException) { }
        }
        string fixedPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), @"nodejs\node.exe");
        return File.Exists(fixedPath) ? fixedPath : null;
    }

    static bool StartServer()
    {
        string node = FindNode();
        if (node == null)
        {
            Fail("Node.js nuk u gjet. IDMIS ka nevojë për Node.js për hyrjen në sistem.");
            return false;
        }
        if (!File.Exists(Path.Combine(ServerDir, "server.js")) || !File.Exists(Path.Combine(ServerDir, ".env")))
        {
            Fail("Serveri i IDMIS nuk u gjet ose nuk është konfiguruar:\n" + ServerDir);
            return false;
        }

        ProcessStartInfo psi = new ProcessStartInfo(node, "server.js")
        {
            WorkingDirectory = ServerDir,
            UseShellExecute = false,
            CreateNoWindow = true,
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            StandardOutputEncoding = System.Text.Encoding.UTF8,
            StandardErrorEncoding = System.Text.Encoding.UTF8,
        };
        serverProcess = Process.Start(psi);
        serverProcess.OutputDataReceived += (s, e) => { if (e.Data != null) Log("server: " + e.Data); };
        serverProcess.ErrorDataReceived += (s, e) => { if (e.Data != null) Log("server error: " + e.Data); };
        serverProcess.BeginOutputReadLine();
        serverProcess.BeginErrorReadLine();
        Log("server started, pid " + serverProcess.Id);

        for (int i = 0; i < 60; i++)
        {
            if (serverProcess.HasExited)
            {
                Fail("Serveri i IDMIS u ndal menjëherë.\nShihni " + Path.Combine(DataDir, "launcher.log"));
                return false;
            }
            if (Ping() == PingReply) return true;
            Thread.Sleep(250);
        }
        Fail("Serveri i IDMIS nuk u përgjigj brenda 15 sekondave.\nShihni " + Path.Combine(DataDir, "launcher.log"));
        return false;
    }

    static void StopServer()
    {
        try
        {
            if (serverProcess != null && !serverProcess.HasExited)
            {
                serverProcess.Kill();
                serverProcess.WaitForExit(5000);
                Log("server stopped");
            }
        }
        catch (Exception ex) { Log("server stop failed: " + ex.Message); }
    }

    // Reply of whatever listens on the port: "idmis-hyrje", "idmis" (old launcher), other text, or null (nothing).
    static string Ping()
    {
        try
        {
            HttpWebRequest req = (HttpWebRequest)WebRequest.Create("http://127.0.0.1:" + Port + PingPath);
            req.Timeout = 1500;
            req.Proxy = null;
            using (WebResponse res = req.GetResponse())
            using (StreamReader r = new StreamReader(res.GetResponseStream()))
                return r.ReadToEnd().Trim();
        }
        catch (WebException ex)
        {
            return ex.Response != null ? "" : null;   // something answered with an error status
        }
        catch { return null; }
    }

    // ---- Browser ----------------------------------------------------------------------------

    class Attempt
    {
        public string Exe, Profile; public bool AppMode;
        public Attempt(string exe, string profile, bool appMode) { Exe = exe; Profile = profile; AppMode = appMode; }
    }

    // Opens an IDMIS window and returns the browser profile it runs in, or null if it fell back to
    // the default browser. Each browser gets its own profile so its process lifetime is ours to track.
    static string OpenWindow(string url)
    {
        string data = DataDir;
        string chrome = FindFile(@"Google\Chrome\Application\chrome.exe");
        string edge = FindFile(@"Microsoft\Edge\Application\msedge.exe");

        List<Attempt> attempts = new List<Attempt>();
        if (chrome != null) attempts.Add(new Attempt(chrome, Path.Combine(data, "chrome"), true));
        if (edge != null) attempts.Add(new Attempt(edge, Path.Combine(data, "edge"), true));
        if (edge != null) attempts.Add(new Attempt(edge, Path.Combine(data, "edge"), false)); // Edge --app is broken on some installs

        foreach (Attempt a in attempts)
        {
            // Profile already open (e.g. second launch): the browser hands the window to the running instance.
            bool alreadyRunning = ProfileInUse(a.Profile);
            Directory.CreateDirectory(a.Profile);
            string args = (a.AppMode ? "--app=\"" + url + "\"" : "--new-window \"" + url + "\"")
                + " --user-data-dir=\"" + a.Profile + "\""
                + " --no-first-run --no-default-browser-check --disable-background-mode --start-maximized";
            Log("launch " + a.Exe + " " + args + (alreadyRunning ? " (profile already open)" : ""));
            try { Process.Start(new ProcessStartInfo(a.Exe, args) { UseShellExecute = false }); }
            catch (Exception ex) { Log("  start failed: " + ex.Message); continue; }
            if (alreadyRunning) return a.Profile;

            // A browser that quits within a few seconds of launch didn't manage to open a window.
            for (int i = 0; i < 5 && ProfileInUse(a.Profile); i++) Thread.Sleep(1000);
            if (ProfileInUse(a.Profile)) { Log("  running"); return a.Profile; }
            Log("  browser exited early, trying next");
        }

        Log("falling back to default browser");
        Process.Start(url); // default browser
        return null;
    }

    static string FindFile(string relative)
    {
        foreach (Environment.SpecialFolder root in new[] {
            Environment.SpecialFolder.ProgramFiles, Environment.SpecialFolder.ProgramFilesX86, Environment.SpecialFolder.LocalApplicationData })
        {
            string p = Path.Combine(Environment.GetFolderPath(root), relative);
            if (File.Exists(p)) return p;
        }
        return null;
    }

    static bool ProfileInUse(string profile)
    {
        try
        {
            using (ManagementObjectSearcher s = new ManagementObjectSearcher(
                "SELECT CommandLine FROM Win32_Process WHERE Name='chrome.exe' OR Name='msedge.exe'"))
            {
                foreach (ManagementObject p in s.Get())
                {
                    string cmd = p["CommandLine"] as string;
                    if (cmd != null && cmd.IndexOf(profile, StringComparison.OrdinalIgnoreCase) >= 0) return true;
                }
            }
            return false;
        }
        catch (Exception ex) { Log("process query failed: " + ex.Message); return false; }
    }

    // No Edge/Chrome: page opened in the default browser, so keep the server alive behind a tray icon.
    static void RunTrayFallback()
    {
        NotifyIcon tray = new NotifyIcon
        {
            Icon = System.Drawing.Icon.ExtractAssociatedIcon(Application.ExecutablePath),
            Text = "IDMIS",
            Visible = true,
            ContextMenu = new ContextMenu(new[]
            {
                new MenuItem("Hap IDMIS", (s, e) => Process.Start("http://127.0.0.1:" + Port + "/" + StartPage)),
                new MenuItem("Mbyll IDMIS", (s, e) => Application.Exit()),
            }),
        };
        tray.ShowBalloonTip(4000, "IDMIS", "IDMIS po punon. Klikoni ikonën për ta mbyllur.", ToolTipIcon.Info);
        Application.Run();
        tray.Visible = false;
    }
}
