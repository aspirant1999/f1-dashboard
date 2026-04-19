import { useState, useEffect } from "react";

// ============ DATA (2026 season, through Japan GP — Round 3) ============

const TEAMS = {
  "Mercedes":    { color: "#00D7B6", accent: "#00A890", hq: "Brackley, UK 🇬🇧",       engine: "Mercedes",  founded: 1970, titles: 8 },
  "Ferrari":     { color: "#DC0000", accent: "#FFD700", hq: "Maranello, Italy 🇮🇹",   engine: "Ferrari",   founded: 1929, titles: 16 },
  "McLaren":     { color: "#FF8000", accent: "#47C7FC", hq: "Woking, UK 🇬🇧",         engine: "Mercedes",  founded: 1963, titles: 9 },
  "Red Bull":    { color: "#1E41FF", accent: "#DC0000", hq: "Milton Keynes, UK 🇬🇧",  engine: "Ford/RBPT", founded: 2005, titles: 6 },
  "Aston Martin":{ color: "#006F62", accent: "#CEDC00", hq: "Silverstone, UK 🇬🇧",    engine: "Honda",     founded: 2021, titles: 0 },
  "Alpine":      { color: "#0090FF", accent: "#FF87BC", hq: "Enstone, UK 🇬🇧",        engine: "Renault",   founded: 1981, titles: 2 },
  "Williams":    { color: "#005AFF", accent: "#FFFFFF", hq: "Grove, UK 🇬🇧",          engine: "Mercedes",  founded: 1977, titles: 9 },
  "Haas":        { color: "#B6BABD", accent: "#DC0000", hq: "Kannapolis, USA 🇺🇸",    engine: "Ferrari",   founded: 2016, titles: 0 },
  "Racing Bulls":{ color: "#6692FF", accent: "#FFFFFF", hq: "Faenza, Italy 🇮🇹",      engine: "Ford/RBPT", founded: 2006, titles: 0 },
  "Audi":        { color: "#52E252", accent: "#000000", hq: "Hinwil, Switzerland 🇨🇭", engine: "Audi",      founded: 2026, titles: 0 },
  "Cadillac":    { color: "#FFFFFF", accent: "#DC0000", hq: "Silverstone, UK 🇬🇧",    engine: "Ferrari",   founded: 2026, titles: 0 },
};

const FALLBACK_DRIVERS = [
  { pos: 1,  code: "ANT", name: "Kimi Antonelli",  first: "Kimi",     last: "Antonelli",  number: 12, team: "Mercedes",     nat: "🇮🇹", points: 72, best: "P1 CHN,JPN", podiums: 3, wins: 2 },
  { pos: 2,  code: "RUS", name: "George Russell",  first: "George",   last: "Russell",    number: 63, team: "Mercedes",     nat: "🇬🇧", points: 63, best: "P1 AUS",      podiums: 2, wins: 1 },
  { pos: 3,  code: "LEC", name: "Charles Leclerc", first: "Charles",  last: "Leclerc",    number: 16, team: "Ferrari",      nat: "🇲🇨", points: 49, best: "P3 AUS,JPN",  podiums: 2, wins: 0 },
  { pos: 4,  code: "HAM", name: "Lewis Hamilton",  first: "Lewis",    last: "Hamilton",   number: 44, team: "Ferrari",      nat: "🇬🇧", points: 41, best: "P3 CHN",      podiums: 1, wins: 0 },
  { pos: 5,  code: "NOR", name: "Lando Norris",    first: "Lando",    last: "Norris",     number: 4,  team: "McLaren",      nat: "🇬🇧", points: 25, best: "P4 CHN",      podiums: 0, wins: 0 },
  { pos: 6,  code: "PIA", name: "Oscar Piastri",   first: "Oscar",    last: "Piastri",    number: 81, team: "McLaren",      nat: "🇦🇺", points: 22, best: "P2 JPN",      podiums: 1, wins: 0 },
  { pos: 7,  code: "VER", name: "Max Verstappen",  first: "Max",      last: "Verstappen", number: 1,  team: "Red Bull",     nat: "🇳🇱", points: 16, best: "P5 AUS",      podiums: 0, wins: 0 },
  { pos: 8,  code: "HAD", name: "Isack Hadjar",    first: "Isack",    last: "Hadjar",     number: 6,  team: "Red Bull",     nat: "🇫🇷", points: 12, best: "P6 JPN",      podiums: 0, wins: 0 },
  { pos: 9,  code: "ALO", name: "Fernando Alonso", first: "Fernando", last: "Alonso",     number: 14, team: "Aston Martin", nat: "🇪🇸", points: 8,  best: "P7 JPN",      podiums: 0, wins: 0 },
  { pos: 10, code: "OCO", name: "Esteban Ocon",    first: "Esteban",  last: "Ocon",       number: 31, team: "Haas",         nat: "🇫🇷", points: 6,  best: "P8 CHN",      podiums: 0, wins: 0 },
  { pos: 11, code: "STR", name: "Lance Stroll",    first: "Lance",    last: "Stroll",     number: 18, team: "Aston Martin", nat: "🇨🇦", points: 0,  best: "DNF",         podiums: 0, wins: 0 },
  { pos: 12, code: "GAS", name: "Pierre Gasly",    first: "Pierre",   last: "Gasly",      number: 10, team: "Alpine",       nat: "🇫🇷", points: 4,  best: "P9 CHN",      podiums: 0, wins: 0 },
  { pos: 13, code: "BEA", name: "Oliver Bearman",  first: "Oliver",   last: "Bearman",    number: 87, team: "Haas",         nat: "🇬🇧", points: 3,  best: "P10 AUS",     podiums: 0, wins: 0 },
  { pos: 14, code: "LIN", name: "Arvid Lindblad",  first: "Arvid",    last: "Lindblad",   number: 30, team: "Racing Bulls", nat: "🇸🇪", points: 2,  best: "P10 JPN",     podiums: 0, wins: 0 },
  { pos: 15, code: "ALB", name: "Alex Albon",      first: "Alex",     last: "Albon",      number: 23, team: "Williams",     nat: "🇹🇭", points: 4,  best: "P9 JPN",      podiums: 0, wins: 0 },
  { pos: 16, code: "PER", name: "Sergio Pérez",    first: "Sergio",   last: "Pérez",      number: 11, team: "Cadillac",     nat: "🇲🇽", points: 0,  best: "P12",         podiums: 0, wins: 0 },
  { pos: 17, code: "BOT", name: "Valtteri Bottas", first: "Valtteri", last: "Bottas",     number: 77, team: "Cadillac",     nat: "🇫🇮", points: 0,  best: "P13",         podiums: 0, wins: 0 },
  { pos: 18, code: "HUL", name: "Nico Hülkenberg", first: "Nico",     last: "Hülkenberg", number: 27, team: "Audi",         nat: "🇩🇪", points: 1,  best: "P10",         podiums: 0, wins: 0 },
];

const FALLBACK_CONSTRUCTORS = [
  { pos: 1,  team: "Mercedes",     points: 135, wins: 3, podiums: 5, drivers: ["ANT", "RUS"] },
  { pos: 2,  team: "Ferrari",      points: 90,  wins: 0, podiums: 4, drivers: ["LEC", "HAM"] },
  { pos: 3,  team: "McLaren",      points: 47,  wins: 0, podiums: 1, drivers: ["NOR", "PIA"] },
  { pos: 4,  team: "Red Bull",     points: 28,  wins: 0, podiums: 0, drivers: ["VER", "HAD"] },
  { pos: 5,  team: "Haas",         points: 9,   wins: 0, podiums: 0, drivers: ["OCO", "BEA"] },
  { pos: 6,  team: "Aston Martin", points: 8,   wins: 0, podiums: 0, drivers: ["ALO", "STR"] },
  { pos: 7,  team: "Williams",     points: 4,   wins: 0, podiums: 0, drivers: ["ALB"] },
  { pos: 8,  team: "Alpine",       points: 4,   wins: 0, podiums: 0, drivers: ["GAS"] },
  { pos: 9,  team: "Racing Bulls", points: 2,   wins: 0, podiums: 0, drivers: ["LIN"] },
  { pos: 10, team: "Audi",         points: 1,   wins: 0, podiums: 0, drivers: ["HUL"] },
  { pos: 11, team: "Cadillac",     points: 0,   wins: 0, podiums: 0, drivers: ["PER", "BOT"] },
];

const FALLBACK_COMPLETED_RACES = [
  { round: 1, name: "Australian Grand Prix", short: "AUS", circuit: "Albert Park, Melbourne", date: "Mar 8", flag: "🇦🇺",
    podium: ["RUS", "ANT", "LEC"], results: { HAM: 6, LEC: 3, ANT: 2, RUS: 1, NOR: 7, PIA: "DNF", VER: 5, ALO: "DNF", STR: "DNF", OCO: 11, BEA: 10 } },
  { round: 2, name: "Chinese Grand Prix", short: "CHN", circuit: "Shanghai International", date: "Mar 15", flag: "🇨🇳", sprint: true,
    podium: ["ANT", "RUS", "HAM"], results: { HAM: 3, LEC: 4, ANT: 1, RUS: 2, NOR: 5, PIA: 6, VER: 8, ALO: 11, STR: "DNF", OCO: 8, BEA: 12 } },
  { round: 3, name: "Japanese Grand Prix", short: "JPN", circuit: "Suzuka", date: "Mar 29", flag: "🇯🇵",
    podium: ["ANT", "PIA", "LEC"], results: { HAM: 5, LEC: 3, ANT: 1, RUS: 4, NOR: 7, PIA: 2, VER: 6, ALO: 7, STR: "DNF", OCO: 14, BEA: "DNF" } },
];

const UPCOMING_RACES = [
  { round: 4,  name: "Miami Grand Prix",           circuit: "Miami Int'l Autodrome",     date: "May 3, 2026",  sprint: true,  iso: "2026-05-03T20:00:00Z", flag: "🇺🇸" },
  { round: 5,  name: "Canadian Grand Prix",        circuit: "Circuit Gilles Villeneuve", date: "May 24, 2026", sprint: true,  iso: "2026-05-24T18:00:00Z", flag: "🇨🇦" },
  { round: 6,  name: "Monaco Grand Prix",          circuit: "Circuit de Monaco",         date: "Jun 7, 2026",  sprint: false, iso: "2026-06-07T13:00:00Z", flag: "🇲🇨" },
  { round: 7,  name: "Spanish GP — Barcelona",     circuit: "Circuit de Barcelona",      date: "Jun 14, 2026", sprint: false, iso: "2026-06-14T13:00:00Z", flag: "🇪🇸" },
  { round: 8,  name: "Austrian Grand Prix",        circuit: "Red Bull Ring",             date: "Jun 28, 2026", sprint: false, iso: "2026-06-28T13:00:00Z", flag: "🇦🇹" },
  { round: 9,  name: "British Grand Prix",         circuit: "Silverstone",               date: "Jul 5, 2026",  sprint: true,  iso: "2026-07-05T14:00:00Z", flag: "🇬🇧" },
  { round: 10, name: "Belgian Grand Prix",         circuit: "Spa-Francorchamps",         date: "Jul 19, 2026", sprint: false, iso: "2026-07-19T13:00:00Z", flag: "🇧🇪" },
  { round: 11, name: "Hungarian Grand Prix",       circuit: "Hungaroring",               date: "Jul 26, 2026", sprint: false, iso: "2026-07-26T13:00:00Z", flag: "🇭🇺" },
  { round: 12, name: "Dutch Grand Prix",           circuit: "Zandvoort",                 date: "Aug 23, 2026", sprint: true,  iso: "2026-08-23T13:00:00Z", flag: "🇳🇱" },
  { round: 13, name: "Italian Grand Prix",         circuit: "Monza",                     date: "Sep 6, 2026",  sprint: false, iso: "2026-09-06T13:00:00Z", flag: "🇮🇹" },
  { round: 14, name: "Madrid Grand Prix",          circuit: "IFEMA Madring",             date: "Sep 13, 2026", sprint: false, iso: "2026-09-13T13:00:00Z", flag: "🇪🇸" },
  { round: 15, name: "Azerbaijan Grand Prix",      circuit: "Baku City Circuit",         date: "Sep 26, 2026", sprint: false, iso: "2026-09-26T11:00:00Z", flag: "🇦🇿" },
  { round: 16, name: "Singapore Grand Prix",       circuit: "Marina Bay",                date: "Oct 11, 2026", sprint: true,  iso: "2026-10-11T12:00:00Z", flag: "🇸🇬" },
  { round: 17, name: "United States Grand Prix",   circuit: "Circuit of the Americas",   date: "Oct 25, 2026", sprint: false, iso: "2026-10-25T19:00:00Z", flag: "🇺🇸" },
  { round: 18, name: "Mexico City Grand Prix",     circuit: "Autódromo H. Rodríguez",    date: "Nov 1, 2026",  sprint: false, iso: "2026-11-01T20:00:00Z", flag: "🇲🇽" },
  { round: 19, name: "São Paulo Grand Prix",       circuit: "Interlagos",                date: "Nov 8, 2026",  sprint: false, iso: "2026-11-08T17:00:00Z", flag: "🇧🇷" },
  { round: 20, name: "Las Vegas Grand Prix",       circuit: "Las Vegas Strip",           date: "Nov 21, 2026", sprint: false, iso: "2026-11-21T06:00:00Z", flag: "🇺🇸" },
  { round: 21, name: "Qatar Grand Prix",           circuit: "Lusail Int'l",              date: "Nov 29, 2026", sprint: false, iso: "2026-11-29T17:00:00Z", flag: "🇶🇦" },
  { round: 22, name: "Abu Dhabi Grand Prix",       circuit: "Yas Marina",                date: "Dec 6, 2026",  sprint: false, iso: "2026-12-06T13:00:00Z", flag: "🇦🇪" },
];

// ============ LIVE DATA LAYER (Jolpica F1 API) ============
// Fetches current standings from Jolpica, the free Ergast-compatible API.
// Falls back to hardcoded data above if the API is unreachable.

const API_BASE = "https://api.jolpi.ca/ergast/f1/2026";

// Maps Jolpica's constructorId to our TEAMS keys (which hold color + metadata).
const CONSTRUCTOR_ID_TO_TEAM = {
  mercedes: "Mercedes",
  ferrari: "Ferrari",
  mclaren: "McLaren",
  red_bull: "Red Bull",
  aston_martin: "Aston Martin",
  alpine: "Alpine",
  williams: "Williams",
  haas: "Haas",
  rb: "Racing Bulls",
  racing_bulls: "Racing Bulls",
  alphatauri: "Racing Bulls",
  audi: "Audi",
  sauber: "Audi",
  cadillac: "Cadillac",
};

// Maps Jolpica's driverId to our 3-letter code. Covers the full 2026 grid.
const DRIVER_ID_TO_CODE = {
  antonelli: "ANT", kimi_antonelli: "ANT",
  russell: "RUS",
  leclerc: "LEC",
  hamilton: "HAM",
  norris: "NOR",
  piastri: "PIA",
  max_verstappen: "VER", verstappen: "VER",
  hadjar: "HAD", isack_hadjar: "HAD",
  alonso: "ALO",
  ocon: "OCO",
  stroll: "STR",
  gasly: "GAS",
  bearman: "BEA",
  lindblad: "LIN", arvid_lindblad: "LIN",
  albon: "ALB",
  perez: "PER", sergio_perez: "PER",
  bottas: "BOT",
  hulkenberg: "HUL",
  sainz: "SAI",
  tsunoda: "TSU",
};

// Maps nationality strings from Jolpica to flag emojis.
const NAT_TO_FLAG = {
  British: "🇬🇧", Italian: "🇮🇹", Monegasque: "🇲🇨", Dutch: "🇳🇱",
  French: "🇫🇷", Spanish: "🇪🇸", Australian: "🇦🇺", Canadian: "🇨🇦",
  Finnish: "🇫🇮", Mexican: "🇲🇽", German: "🇩🇪", Thai: "🇹🇭",
  Swedish: "🇸🇪", American: "🇺🇸", Japanese: "🇯🇵", Brazilian: "🇧🇷",
};

// Maps Jolpica country name → 3-letter race code used in UI.
const COUNTRY_TO_SHORT = {
  Australia: "AUS", China: "CHN", Japan: "JPN", USA: "USA", "United States": "USA",
  Canada: "CAN", Monaco: "MON", Spain: "ESP", Austria: "AUT", UK: "GBR", "United Kingdom": "GBR",
  Belgium: "BEL", Hungary: "HUN", Netherlands: "NED", Italy: "ITA", Azerbaijan: "AZE",
  Singapore: "SGP", Mexico: "MEX", Brazil: "BRA", Qatar: "QAT", UAE: "UAE",
  "United Arab Emirates": "UAE", France: "FRA", Germany: "DEU", Saudi: "SAU",
};

const COUNTRY_TO_FLAG = {
  Australia: "🇦🇺", China: "🇨🇳", Japan: "🇯🇵", USA: "🇺🇸", "United States": "🇺🇸",
  Canada: "🇨🇦", Monaco: "🇲🇨", Spain: "🇪🇸", Austria: "🇦🇹", UK: "🇬🇧", "United Kingdom": "🇬🇧",
  Belgium: "🇧🇪", Hungary: "🇭🇺", Netherlands: "🇳🇱", Italy: "🇮🇹", Azerbaijan: "🇦🇿",
  Singapore: "🇸🇬", Mexico: "🇲🇽", Brazil: "🇧🇷", Qatar: "🇶🇦", UAE: "🇦🇪",
  "United Arab Emirates": "🇦🇪", France: "🇫🇷", Germany: "🇩🇪",
};

async function fetchJSON(url) {
  const res = await fetch(url + ".json");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// Transforms Jolpica driver standings response into our DRIVERS shape.
function mapDriverStandings(json) {
  const standingsList = json?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings;
  if (!standingsList || standingsList.length === 0) return null;
  return standingsList.map(s => {
    const d = s.Driver;
    const c = s.Constructors?.[0];
    const code = DRIVER_ID_TO_CODE[d.driverId] || (d.code || d.driverId.substring(0, 3).toUpperCase());
    const team = CONSTRUCTOR_ID_TO_TEAM[c?.constructorId] || c?.name || "Unknown";
    return {
      pos: parseInt(s.position, 10),
      code,
      name: `${d.givenName} ${d.familyName}`,
      first: d.givenName,
      last: d.familyName,
      number: parseInt(d.permanentNumber, 10) || 0,
      team,
      nat: NAT_TO_FLAG[d.nationality] || "",
      points: parseFloat(s.points) || 0,
      best: "—",
      podiums: 0,
      wins: parseInt(s.wins, 10) || 0,
    };
  });
}

// Transforms Jolpica constructor standings into our CONSTRUCTORS shape.
function mapConstructorStandings(json, drivers) {
  const standingsList = json?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings;
  if (!standingsList || standingsList.length === 0) return null;
  return standingsList.map(s => {
    const team = CONSTRUCTOR_ID_TO_TEAM[s.Constructor.constructorId] || s.Constructor.name;
    const teamDrivers = drivers ? drivers.filter(d => d.team === team).map(d => d.code) : [];
    return {
      pos: parseInt(s.position, 10),
      team,
      points: parseFloat(s.points) || 0,
      wins: parseInt(s.wins, 10) || 0,
      podiums: 0, // not provided directly by this endpoint
      drivers: teamDrivers,
    };
  });
}

// Transforms completed race results into our COMPLETED_RACES shape.
// Fetches results for every completed round.
async function mapCompletedRaces(resultsJson) {
  const races = resultsJson?.MRData?.RaceTable?.Races || [];
  return races.map(r => {
    const top3 = r.Results.slice(0, 3).map(res => DRIVER_ID_TO_CODE[res.Driver.driverId] || res.Driver.code || "?");
    const results = {};
    r.Results.forEach(res => {
      const code = DRIVER_ID_TO_CODE[res.Driver.driverId] || res.Driver.code;
      if (!code) return;
      const status = res.status;
      const pos = parseInt(res.position, 10);
      results[code] = (status && status !== "Finished" && !status.startsWith("+")) ? "DNF" : pos;
    });
    const dateObj = new Date(r.date);
    const country = r.Circuit.Location.country;
    const short = COUNTRY_TO_SHORT[country] || r.raceName.replace(" Grand Prix", "").substring(0, 3).toUpperCase();
    const countryFlag = COUNTRY_TO_FLAG[country] || "";
    return {
      round: parseInt(r.round, 10),
      name: r.raceName,
      short,
      circuit: `${r.Circuit.circuitName}, ${r.Circuit.Location.locality}`,
      date: dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      flag: countryFlag,
      sprint: false, // sprint flag not in the same endpoint
      podium: top3,
      results,
    };
  });
}

function useLiveData() {
  const [state, setState] = useState({
    drivers: FALLBACK_DRIVERS,
    constructors: FALLBACK_CONSTRUCTORS,
    races: FALLBACK_COMPLETED_RACES,
    status: "loading", // loading | live | fallback
    lastUpdated: null,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [dJson, cJson, rJson] = await Promise.all([
          fetchJSON(`${API_BASE}/driverstandings/`),
          fetchJSON(`${API_BASE}/constructorstandings/`),
          fetchJSON(`${API_BASE}/results/`),
        ]);
        if (cancelled) return;
        const liveDrivers = mapDriverStandings(dJson);
        const liveConstructors = mapConstructorStandings(cJson, liveDrivers);
        const liveRaces = await mapCompletedRaces(rJson);

        if (!liveDrivers || !liveConstructors) {
          setState(s => ({ ...s, status: "fallback" }));
          return;
        }

        // Mark sprint races using our hardcoded calendar (source of truth for schedule).
        const sprintRounds = new Set([2, 4, 5, 9, 12, 16]); // from UPCOMING/completed calendar
        const racesWithSprintFlag = liveRaces.map(r => ({ ...r, sprint: sprintRounds.has(r.round) }));

        setState({
          drivers: liveDrivers,
          constructors: liveConstructors,
          races: racesWithSprintFlag.length > 0 ? racesWithSprintFlag : FALLBACK_COMPLETED_RACES,
          status: "live",
          lastUpdated: new Date(),
        });
      } catch (err) {
        console.warn("Jolpica API unreachable, using fallback data:", err);
        if (!cancelled) setState(s => ({ ...s, status: "fallback" }));
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return state;
}

// ============ COUNTDOWN ============
function useCountdown(iso) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, new Date(iso) - now);
  return {
    days:  Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins:  Math.floor((diff % 3600000) / 60000),
    secs:  Math.floor((diff % 60000) / 1000),
  };
}

// ============ HELPERS ============
function hexToRgba(hex, alpha) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0,2), 16);
  const g = parseInt(h.substring(2,4), 16);
  const b = parseInt(h.substring(4,6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ============ MAIN ============

export default function F1Dashboard() {
  const [screen, setScreen] = useState("loading"); // loading | welcome | setup | dashboard
  const [userName, setUserName] = useState("");
  const [driverCode, setDriverCode] = useState("");
  const [teamName, setTeamName] = useState("");

  // Fetch live season data from Jolpica F1 API (with fallback to hardcoded)
  const liveData = useLiveData();

  // Resume session if saved
  useEffect(() => {
    try {
      const raw = localStorage.getItem("f1-session");
      if (raw) {
        const s = JSON.parse(raw);
        if (s.userName && s.driverCode && s.teamName) {
          setUserName(s.userName);
          setDriverCode(s.driverCode);
          setTeamName(s.teamName);
          setScreen("dashboard");
          return;
        }
      }
    } catch (_) {}
    setScreen("welcome");
  }, []);

  const savePrefs = (name, drv, tm) => {
    try {
      localStorage.setItem("f1-session", JSON.stringify({ userName: name, driverCode: drv, teamName: tm }));
    } catch (_) {}
  };

  const resetPrefs = () => {
    try { localStorage.removeItem("f1-session"); } catch (_) {}
    setUserName(""); setDriverCode(""); setTeamName("");
    setScreen("welcome");
  };

  return (
    <>
      <GlobalStyles />
      {screen === "loading" && <div className="min-h-screen bg-black" />}
      {screen === "welcome" && <WelcomeScreen onStart={() => setScreen("setup")} />}
      {screen === "setup" && (
        <SetupScreen
          initialName={userName}
          initialDriver={driverCode}
          initialTeam={teamName}
          drivers={liveData.drivers}
          onComplete={(n, d, t) => {
            setUserName(n); setDriverCode(d); setTeamName(t);
            savePrefs(n, d, t);
            setScreen("dashboard");
          }}
        />
      )}
      {screen === "dashboard" && (
        <Dashboard
          userName={userName}
          driverCode={driverCode}
          teamName={teamName}
          drivers={liveData.drivers}
          constructors={liveData.constructors}
          races={liveData.races}
          dataStatus={liveData.status}
          lastUpdated={liveData.lastUpdated}
          onReset={resetPrefs}
          onEdit={() => setScreen("setup")}
        />
      )}
    </>
  );
}

// ============ GLOBAL STYLES ============

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;500;700&family=Archivo+Black&display=swap');
      .display { font-family: 'Archivo Black', sans-serif; letter-spacing: -0.02em; }
      .bebas { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.05em; }
      .mono { font-family: 'JetBrains Mono', monospace; }
      .stripe-bg {
        background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 11px);
      }
      .ticker { animation: ticker 50s linear infinite; }
      @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      .pulse-dot { animation: pulse 2s ease-in-out infinite; }
      @keyframes pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.8); } }
      .fade-in { animation: fade 0.5s ease-out; }
      @keyframes fade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    `}</style>
  );
}

// ============ WELCOME ============

function WelcomeScreen({ onStart }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center text-white p-6"
         style={{ background: "radial-gradient(ellipse at center, #1a0a0a 0%, #000 70%)", fontFamily: "'JetBrains Mono', monospace" }}>
      <div className="max-w-2xl w-full fade-in">
        <div className="flex items-center gap-3 mb-4">
          <span className="pulse-dot w-2 h-2 rounded-full bg-red-500" />
          <span className="mono text-xs tracking-widest text-red-400">PIT WALL · 2026 SEASON</span>
        </div>
        <h1 className="display text-7xl md:text-8xl leading-[0.9]">
          YOUR<br/>
          <span style={{ background: "linear-gradient(90deg,#DC0000,#FF8000)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>F1 DASHBOARD</span>
        </h1>
        <p className="bebas text-2xl mt-4 text-white/70">Pick your driver. Pick your team. Own your season.</p>
        <p className="mono text-sm text-white/50 mt-4 leading-relaxed">
          Personalized for every fan — your favorite driver gets highlighted across every stat, standings table,
          and race result. Share this with friends and each of them gets their own custom view.
        </p>
        <button
          onClick={onStart}
          className="mt-8 bebas text-2xl px-10 py-4 border-2 hover:scale-105 transition-transform"
          style={{ borderColor: "#DC0000", background: "rgba(220,0,0,0.15)" }}
        >
          START → ENTER THE PIT WALL
        </button>
        <div className="mt-12 mono text-[10px] text-white/30 tracking-widest">
          2026 SEASON · 22 RACES · 11 TEAMS · 22 DRIVERS · NEW ERA
        </div>
      </div>
    </div>
  );
}

// ============ SETUP ============

function SetupScreen({ initialName, initialDriver, initialTeam, drivers, onComplete }) {
  const [name, setName] = useState(initialName || "");
  const [drv, setDrv] = useState(initialDriver || "");
  const [tm, setTm] = useState(initialTeam || "");
  const [step, setStep] = useState(initialName ? 1 : 0);

  const driversSorted = [...drivers].sort((a, b) => a.last.localeCompare(b.last));
  const teamsArr = Object.keys(TEAMS);

  return (
    <div className="min-h-screen w-full text-white p-6 fade-in"
         style={{ background: "radial-gradient(ellipse at top, #1a0a0a 0%, #000 70%)", fontFamily: "'JetBrains Mono', monospace" }}>
      <div className="max-w-3xl mx-auto pt-10">

        <div className="flex items-center gap-2 mb-8">
          {[0,1,2].map(i => (
            <div key={i} className="h-1 flex-1" style={{ background: i <= step ? "#DC0000" : "rgba(255,255,255,0.1)" }} />
          ))}
        </div>

        {step === 0 && (
          <div className="fade-in">
            <div className="mono text-xs tracking-widest text-red-400 mb-2">STEP 01 · IDENTIFY YOURSELF</div>
            <h2 className="display text-5xl">What's your name?</h2>
            <p className="mono text-sm text-white/50 mt-2">So your friends know whose dashboard they're looking at.</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && name.trim() && setStep(1)}
              placeholder="e.g. Ravi, Sarah, Alex…"
              autoFocus
              className="mt-6 w-full bg-black/60 border-2 border-white/20 focus:border-red-600 outline-none bebas text-3xl px-4 py-3"
            />
            <button
              onClick={() => name.trim() && setStep(1)}
              disabled={!name.trim()}
              className="mt-6 bebas text-2xl px-8 py-3 border-2 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-transform"
              style={{ borderColor: "#DC0000", background: "rgba(220,0,0,0.15)" }}
            >
              NEXT →
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="fade-in">
            <div className="mono text-xs tracking-widest text-red-400 mb-2">STEP 02 · PICK YOUR DRIVER</div>
            <h2 className="display text-5xl">Who do you root for?</h2>
            <p className="mono text-sm text-white/50 mt-2">Your driver will be highlighted across all standings and results.</p>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[50vh] overflow-y-auto pr-2">
              {driversSorted.map(d => {
                const t = TEAMS[d.team];
                const selected = drv === d.code;
                return (
                  <button
                    key={d.code}
                    onClick={() => setDrv(d.code)}
                    className={`text-left p-3 border-2 transition hover:scale-[1.02] ${selected ? "border-white" : "border-white/10 hover:border-white/30"}`}
                    style={{ background: selected ? `${t.color}22` : "rgba(0,0,0,0.5)" }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="mono text-[10px] text-white/40">#{d.number}</div>
                      <div className="w-2 h-2" style={{ background: t.color }} />
                    </div>
                    <div className="bebas text-lg leading-tight mt-1">{d.first}<br/>{d.last}</div>
                    <div className="mono text-[10px] text-white/50 mt-1">{d.nat} {d.team}</div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(0)} className="bebas text-xl px-6 py-3 border-2 border-white/20 hover:border-white/40">← BACK</button>
              <button
                onClick={() => drv && setStep(2)}
                disabled={!drv}
                className="bebas text-2xl px-8 py-3 border-2 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                style={{ borderColor: "#DC0000", background: "rgba(220,0,0,0.15)" }}
              >
                NEXT →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fade-in">
            <div className="mono text-xs tracking-widest text-red-400 mb-2">STEP 03 · PICK YOUR TEAM</div>
            <h2 className="display text-5xl">Which garage?</h2>
            <p className="mono text-sm text-white/50 mt-2">This sets the entire color scheme of your dashboard.</p>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-2">
              {teamsArr.map(tname => {
                const t = TEAMS[tname];
                const selected = tm === tname;
                return (
                  <button
                    key={tname}
                    onClick={() => setTm(tname)}
                    className={`text-left p-4 border-2 transition hover:scale-[1.02] ${selected ? "border-white" : "border-white/10 hover:border-white/30"}`}
                    style={{ background: selected ? `linear-gradient(135deg, ${t.color}33, transparent)` : "rgba(0,0,0,0.5)" }}
                  >
                    <div className="w-full h-1 mb-2" style={{ background: t.color }} />
                    <div className="bebas text-xl">{tname}</div>
                    <div className="mono text-[10px] text-white/40 mt-1">EST. {t.founded} · {t.titles} TITLES</div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(1)} className="bebas text-xl px-6 py-3 border-2 border-white/20 hover:border-white/40">← BACK</button>
              <button
                onClick={() => tm && onComplete(name, drv, tm)}
                disabled={!tm}
                className="bebas text-2xl px-8 py-3 border-2 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                style={{ borderColor: "#DC0000", background: "rgba(220,0,0,0.15)" }}
              >
                ENTER DASHBOARD →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ DASHBOARD ============

function Dashboard({ userName, driverCode, teamName, drivers: DRIVERS, constructors: CONSTRUCTORS, races: COMPLETED_RACES, dataStatus, lastUpdated, onReset, onEdit }) {
  const today = new Date();
  const completedRounds = new Set(COMPLETED_RACES.map(r => r.round));
  const nextRace = UPCOMING_RACES.find(r => !completedRounds.has(r.round) && new Date(r.iso) > today)
                || UPCOMING_RACES.find(r => !completedRounds.has(r.round))
                || UPCOMING_RACES[0];
  const cd = useCountdown(nextRace.iso);

  // Safely resolve driver/team. If the user's saved pick isn't in the live data (e.g. a driver
  // not yet scored points is missing from standings), fall back to the hardcoded list.
  const myDriver = DRIVERS.find(d => d.code === driverCode)
                || FALLBACK_DRIVERS.find(d => d.code === driverCode)
                || DRIVERS[0];
  const myTeam = CONSTRUCTORS.find(c => c.team === teamName)
              || FALLBACK_CONSTRUCTORS.find(c => c.team === teamName)
              || CONSTRUCTORS[0];
  const myTeamMeta = TEAMS[teamName] || TEAMS["Ferrari"];
  const leader = DRIVERS[0];
  const constructorLeader = CONSTRUCTORS[0];

  const primary = myTeamMeta.color;
  const accent = myTeamMeta.accent;

  return (
    <div className="min-h-screen w-full text-white fade-in"
         style={{
           background: `radial-gradient(ellipse at top, ${hexToRgba(primary, 0.12)} 0%, #0a0a0a 45%, #000 100%)`,
           fontFamily: "'JetBrains Mono', monospace",
         }}>

      {/* TICKER */}
      <div className="w-full border-b py-2 overflow-hidden bg-black/60 backdrop-blur" style={{ borderColor: hexToRgba(primary, 0.3) }}>
        <div className="ticker whitespace-nowrap flex gap-12 text-xs mono" style={{ color: hexToRgba(primary, 0.9) }}>
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-12 shrink-0">
              <span>● {userName.toUpperCase()}'S PIT WALL · LIVE</span>
              <span>{myDriver.last.toUpperCase()} P{myDriver.pos} · {myDriver.points} PTS</span>
              <span>{teamName.toUpperCase()} P{myTeam.pos} · {myTeam.points} PTS</span>
              <span>NEXT: {nextRace.name.replace(" Grand Prix", "").toUpperCase()} · {nextRace.date.toUpperCase()}</span>
              <span>{leader.last.toUpperCase()} LEADS · {leader.points} PTS</span>
              <span>NEW ERA · ACTIVE AERO · 100% SUSTAINABLE FUEL</span>
            </div>
          ))}
        </div>
      </div>

      {/* HEADER */}
      <header className="max-w-7xl mx-auto px-6 pt-8 pb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="pulse-dot w-2 h-2 rounded-full" style={{ background: primary }} />
              <span className="text-xs mono tracking-widest" style={{ color: hexToRgba(primary, 0.9) }}>
                PERSONALIZED FOR {userName.toUpperCase()}
              </span>
            </div>
            <h1 className="display text-6xl md:text-7xl leading-none">
              <span className="text-white">PIT</span>{" "}
              <span style={{ color: primary }}>WALL</span>
            </h1>
            <div className="bebas text-2xl mt-2 text-white/70">
              2026 SEASON · <span style={{ color: accent }}>#{myDriver.number} {myDriver.last.toUpperCase()}</span> ·{" "}
              <span style={{ color: primary }}>{teamName.toUpperCase()}</span>
            </div>
          </div>
          <div className="text-right flex flex-col items-end gap-2">
            <div className="mono text-[10px] text-white/40 tracking-widest">
              {today.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
              {" · "}ROUND {COMPLETED_RACES.length} OF 22
            </div>
            <DataStatusBadge status={dataStatus} lastUpdated={lastUpdated} primary={primary} />
            <div className="flex gap-2 flex-wrap justify-end">
              <button onClick={onEdit} className="mono text-[10px] px-3 py-1.5 border border-white/20 hover:border-white/40 tracking-widest">EDIT</button>
              <button onClick={onReset} className="mono text-[10px] px-3 py-1.5 border border-white/20 hover:border-red-500 tracking-widest">RESET</button>
              <ShareButton primary={primary} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-12 gap-4">

        {/* NEXT RACE */}
        <section className="col-span-12 relative overflow-hidden rounded-sm border p-8 md:p-10"
          style={{ background: `linear-gradient(135deg, ${hexToRgba(primary, 0.2)} 0%, rgba(0,0,0,0.9) 80%)`, borderColor: hexToRgba(primary, 0.4) }}>
          <div className="stripe-bg absolute inset-0" />
          <div className="relative grid md:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="pulse-dot w-2 h-2 rounded-full" style={{ background: accent }} />
                <span className="mono text-xs tracking-widest" style={{ color: accent }}>NEXT RACE · ROUND {nextRace.round}</span>
              </div>
              <div className="bebas text-6xl md:text-8xl leading-none">
                {nextRace.flag} {nextRace.name.replace(" Grand Prix", "")}
              </div>
              <div className="bebas text-3xl text-white/50 mt-1">GRAND PRIX</div>
              <div className="mono text-sm text-white/60 mt-4">
                {nextRace.circuit} · {nextRace.date}
                {nextRace.sprint && <span className="ml-3 px-2 py-0.5 border text-xs" style={{ borderColor: accent, color: accent }}>SPRINT</span>}
              </div>
            </div>
            <div className="flex gap-2">
              {[{v:cd.days,l:"DAYS"},{v:cd.hours,l:"HRS"},{v:cd.mins,l:"MIN"},{v:cd.secs,l:"SEC"}].map(({v,l}) => (
                <div key={l} className="bg-black/70 border px-3 py-4 min-w-[70px] text-center" style={{ borderColor: hexToRgba(primary, 0.5) }}>
                  <div className="display text-4xl md:text-5xl tabular-nums" style={{ color: primary }}>{String(v).padStart(2,"0")}</div>
                  <div className="mono text-[10px] text-white/50 tracking-widest mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DRIVER CARD */}
        <section className="col-span-12 md:col-span-5 rounded-sm border p-6"
          style={{ background: `linear-gradient(160deg, ${hexToRgba(primary, 0.2)} 0%, rgba(0,0,0,0.85) 100%)`, borderColor: hexToRgba(accent, 0.5), boxShadow: `0 0 40px ${hexToRgba(accent, 0.1)}` }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="mono text-xs tracking-widest" style={{ color: accent }}>YOUR DRIVER</div>
              <div className="display text-4xl mt-1">{myDriver.name.toUpperCase()}</div>
              <div className="bebas text-xl text-white/60">{myDriver.team.toUpperCase()} · {myDriver.nat}</div>
            </div>
            <div className="display text-6xl" style={{ color: accent }}>{myDriver.number}</div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <Stat label="POSITION" value={`P${myDriver.pos}`} accent={accent} />
            <Stat label="POINTS" value={myDriver.points} />
            <Stat label="GAP TO P1" value={myDriver.pos === 1 ? "—" : `-${leader.points - myDriver.points}`} />
            <Stat label="WINS" value={myDriver.wins} accent={myDriver.wins > 0 ? accent : undefined} />
            <Stat label="PODIUMS" value={myDriver.podiums} />
            <Stat label="BEST" value={myDriver.best.split(" ")[0]} sub={myDriver.best.split(" ")[1]} />
          </div>

          <div className="mt-6">
            <div className="mono text-[10px] tracking-widest text-white/40 mb-2">FORM · LAST 3 RACES</div>
            <div className="flex gap-2">
              {COMPLETED_RACES.map(race => {
                const finish = race.results[myDriver.code];
                return (
                  <div key={race.round} className="flex-1 border border-white/10 p-2 text-center">
                    <div className="mono text-[10px] text-white/40">{race.short}</div>
                    <div className="display text-2xl" style={{ color: typeof finish === "number" && finish <= 3 ? accent : "white" }}>
                      {typeof finish === "number" ? `P${finish}` : finish || "—"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* TEAM CARD */}
        <section className="col-span-12 md:col-span-7 rounded-sm border p-6"
          style={{ background: `linear-gradient(200deg, ${hexToRgba(primary, 0.25)} 0%, rgba(0,0,0,0.9) 70%)`, borderColor: hexToRgba(primary, 0.6) }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="mono text-xs tracking-widest" style={{ color: primary }}>YOUR TEAM</div>
              <div className="display text-4xl mt-1">{teamName.toUpperCase()}</div>
              <div className="bebas text-xl text-white/60">{myTeamMeta.hq} · EST. {myTeamMeta.founded}</div>
            </div>
            <div className="text-right">
              <div className="mono text-[10px] text-white/40">CONSTRUCTORS</div>
              <div className="display text-7xl" style={{ color: primary }}>P{myTeam.pos}</div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 mt-4">
            <Stat label="POINTS" value={myTeam.points} accent={primary} />
            <Stat label="GAP TO P1" value={myTeam.pos === 1 ? "—" : `-${constructorLeader.points - myTeam.points}`} />
            <Stat label="PODIUMS" value={myTeam.podiums} />
            <Stat label="WINS" value={myTeam.wins} accent={myTeam.wins > 0 ? primary : undefined} />
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="border border-white/10 p-3">
              <div className="mono text-[10px] text-white/40">DRIVER LINEUP</div>
              {myTeam.drivers.map(code => {
                const d = DRIVERS.find(dr => dr.code === code);
                return (
                  <div key={code} className="bebas text-lg" style={{ color: code === driverCode ? accent : "white" }}>
                    #{d.number} {d.last.toUpperCase()} · P{d.pos} · {d.points} PTS
                  </div>
                );
              })}
            </div>
            <div className="border border-white/10 p-3">
              <div className="mono text-[10px] text-white/40">PACE VS LEADER</div>
              <div className="mt-2 h-2 bg-white/10 rounded-sm overflow-hidden">
                <div className="h-full" style={{ width: `${(myTeam.points / constructorLeader.points) * 100}%`, background: primary }} />
              </div>
              <div className="mono text-xs text-white/60 mt-2">
                {Math.round((myTeam.points / constructorLeader.points) * 100)}% of {constructorLeader.team}
              </div>
              <div className="mono text-[10px] text-white/40 mt-2">ENGINE · {myTeamMeta.engine}</div>
            </div>
          </div>
        </section>

        {/* DRIVER STANDINGS */}
        <section className="col-span-12 md:col-span-7 rounded-sm border border-white/10 bg-black/60 p-6">
          <SectionTitle label="DRIVERS' CHAMPIONSHIP" count="TOP 10" primary={primary} />
          <div className="mt-4 space-y-1">
            {DRIVERS.slice(0, 10).map(d => {
              const isMine = d.code === driverCode;
              const isMyTeam = d.team === teamName;
              const t = TEAMS[d.team];
              return (
                <div
                  key={d.code}
                  className={`grid grid-cols-[40px_1fr_100px_80px] items-center gap-3 px-3 py-2 transition-colors ${isMine ? "border-l-2" : ""}`}
                  style={{
                    background: isMine ? hexToRgba(accent, 0.1) : isMyTeam ? hexToRgba(primary, 0.08) : "transparent",
                    borderLeftColor: isMine ? accent : "transparent",
                  }}
                >
                  <div className={`display text-xl ${isMine ? "" : "text-white/50"}`} style={isMine ? { color: accent } : {}}>
                    {String(d.pos).padStart(2,"0")}
                  </div>
                  <div>
                    <div className="bebas text-lg leading-tight">
                      {d.name} {isMine && <span style={{ color: accent }}>◆</span>}
                    </div>
                    <div className="mono text-[10px] text-white/40">{d.team} · {d.nat}</div>
                  </div>
                  <div className="h-2 bg-white/5 rounded-sm overflow-hidden">
                    <div className="h-full" style={{ width: `${(d.points/leader.points)*100}%`, background: t.color }} />
                  </div>
                  <div className="display text-xl text-right tabular-nums" style={isMine ? { color: accent } : {}}>
                    {d.points}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* QUICK STATS SIDEBAR (replaces old side constructors list) */}
        <section className="col-span-12 md:col-span-5 rounded-sm border border-white/10 bg-black/60 p-6">
          <SectionTitle label="SEASON AT A GLANCE" count="2026" primary={primary} />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Stat label="RACES RUN" value={COMPLETED_RACES.length} sub="OF 22" />
            <Stat label="REMAINING" value={22 - COMPLETED_RACES.length} />
            <Stat label="SPRINTS LEFT" value={Math.max(0, 6 - COMPLETED_RACES.filter(r => r.sprint).length)} sub="OF 6" />
            <Stat label="POINTS LEADER" value={`${leader.points}`} sub={leader.last.toUpperCase()} accent={TEAMS[leader.team]?.color} />
            <Stat label="MOST WINS" value={leader.wins} sub={leader.last.toUpperCase()} />
            <Stat label="DIFF P1→P2" value={DRIVERS.length > 1 ? `${leader.points - DRIVERS[1].points}` : "—"} sub="POINTS" />
          </div>
          <div className="mt-4 border border-white/10 p-3">
            <div className="mono text-[10px] text-white/40 tracking-widest">NEW IN 2026</div>
            <div className="mono text-xs text-white/70 mt-2 leading-relaxed">
              New power units · Active aerodynamics · 100% sustainable fuels · Audi debuts · Cadillac debuts · Madrid joins calendar
            </div>
          </div>
        </section>

        {/* ===== CONSTRUCTORS — COMPACT LIST WITH CLICK-TO-EXPAND ===== */}
        <section className="col-span-12 rounded-sm border border-white/10 bg-black/60 p-6">
          <SectionTitle label="CONSTRUCTORS' CHAMPIONSHIP" count="TAP ANY ROW FOR DETAILS" primary={primary} />

          {/* Collapsible bar chart toggle */}
          <CollapsibleBarChart constructors={CONSTRUCTORS} teams={TEAMS} myTeamName={teamName} leaderPoints={constructorLeader.points} primary={primary} />

          {/* Expandable constructor rows */}
          <div className="mt-4 space-y-1">
            {CONSTRUCTORS.map(c => (
              <ConstructorRow
                key={c.team}
                constructor={c}
                teamMeta={TEAMS[c.team]}
                leaderPoints={constructorLeader.points}
                isMine={c.team === teamName}
                myDriverCode={driverCode}
                drivers={DRIVERS}
                primary={primary}
                accent={accent}
              />
            ))}
          </div>
        </section>

        {/* RACE RESULTS */}
        <section className="col-span-12 rounded-sm border border-white/10 bg-black/60 p-6">
          <SectionTitle label="COMPLETED RACES" count={`TAP TO EXPAND · ${COMPLETED_RACES.length} OF 22`} primary={primary} />
          <div className="mt-4 grid md:grid-cols-3 gap-4">
            {COMPLETED_RACES.map(race => (
              <RaceCard
                key={race.round}
                race={race}
                myDriver={myDriver}
                driverCode={driverCode}
                teamName={teamName}
                drivers={DRIVERS}
                primary={primary}
                accent={accent}
              />
            ))}
          </div>
        </section>

        {/* CALENDAR */}
        <section className="col-span-12 rounded-sm border border-white/10 bg-black/60 p-6">
          {(() => {
            const upcoming = UPCOMING_RACES.filter(r => !completedRounds.has(r.round));
            return (
              <>
                <SectionTitle label="UPCOMING CALENDAR" count={`${upcoming.length} REMAINING`} primary={primary} />
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {upcoming.map((r, i) => (
                    <div key={r.round}
                      className="border p-3 transition hover:scale-[1.02]"
                      style={{
                        borderColor: i === 0 ? primary : "rgba(255,255,255,0.1)",
                        background: i === 0 ? hexToRgba(primary, 0.1) : "transparent",
                      }}>
                      <div className="flex items-center justify-between">
                        <div className="mono text-[10px] text-white/40">RD {String(r.round).padStart(2,"0")}</div>
                        {i === 0 && <span className="mono text-[10px]" style={{ color: primary }}>NEXT</span>}
                        {r.sprint && i !== 0 && <span className="mono text-[10px]" style={{ color: accent }}>SPR</span>}
                      </div>
                      <div className="bebas text-base mt-1 leading-tight">{r.flag} {r.name.replace(" Grand Prix","")}</div>
                      <div className="mono text-[10px] text-white/40 mt-1">{r.date}</div>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </section>

        <footer className="col-span-12 mt-4 pt-6 border-t flex flex-wrap items-center justify-between gap-2" style={{ borderColor: hexToRgba(primary, 0.3) }}>
          <div className="mono text-[10px] text-white/30 tracking-widest">
            2026 · NEW REGS · ACTIVE AERO · 100% SUSTAINABLE FUELS
          </div>
          <div className="mono text-[10px] tracking-widest" style={{ color: hexToRgba(primary, 0.6) }}>
            BUILT FOR {userName.toUpperCase()} ◆
          </div>
        </footer>
      </main>
    </div>
  );
}

// ============ SUB-COMPONENTS ============

function Stat({ label, value, sub, accent }) {
  return (
    <div className="border border-white/10 p-3 bg-black/40">
      <div className="mono text-[10px] text-white/40 tracking-widest">{label}</div>
      <div className="display text-3xl tabular-nums mt-1" style={{ color: accent || "white" }}>{value}</div>
      {sub && <div className="mono text-[10px] text-white/40 mt-0.5">{sub}</div>}
    </div>
  );
}

function SectionTitle({ label, count, primary }) {
  return (
    <div className="flex items-end justify-between border-b pb-2" style={{ borderColor: hexToRgba(primary || "#ffffff", 0.3) }}>
      <div className="bebas text-2xl">{label}</div>
      <div className="mono text-[10px] text-white/40 tracking-widest">{count}</div>
    </div>
  );
}

function ShareButton({ primary }) {
  const [copied, setCopied] = useState(false);
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <button
      onClick={handleShare}
      className="mono text-[10px] px-3 py-1.5 border tracking-widest transition"
      style={{ borderColor: primary, color: primary }}
    >
      {copied ? "✓ COPIED" : "SHARE →"}
    </button>
  );
}

function DataStatusBadge({ status, lastUpdated, primary }) {
  const config = {
    loading:  { dot: "#FFD700", text: "LOADING LIVE DATA…", color: "rgba(255,215,0,0.8)" },
    live:     { dot: "#22C55E", text: "LIVE · JOLPICA API",  color: "rgba(34,197,94,0.9)" },
    fallback: { dot: "#F97316", text: "OFFLINE · CACHED DATA", color: "rgba(249,115,22,0.9)" },
  };
  const cfg = config[status] || config.loading;
  const timeStr = lastUpdated ? lastUpdated.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "";
  return (
    <div className="flex items-center gap-2 mono text-[10px] tracking-widest" style={{ color: cfg.color }}>
      <span className={status === "loading" ? "pulse-dot" : ""} style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: cfg.dot }} />
      <span>{cfg.text}{status === "live" && timeStr && ` · ${timeStr}`}</span>
    </div>
  );
}

// ============ COLLAPSIBLE COMPONENTS ============

function CollapsibleBarChart({ constructors, teams, myTeamName, leaderPoints, primary }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 mono text-[10px] tracking-widest text-white/60 hover:text-white transition"
      >
        <span className={`inline-block transition-transform ${open ? "rotate-90" : ""}`}>▸</span>
        {open ? "HIDE" : "SHOW"} POINTS BAR CHART
      </button>
      {open && (
        <div className="mt-4 space-y-2 fade-in">
          {constructors.map(c => {
            const t = teams[c.team];
            const isMine = c.team === myTeamName;
            const pct = (c.points / leaderPoints) * 100;
            return (
              <div key={c.team} className="flex items-center gap-3">
                <div className="w-8 display text-sm text-white/50">{String(c.pos).padStart(2,"0")}</div>
                <div className="w-28 md:w-40 bebas text-sm truncate" style={{ color: isMine ? primary : "white" }}>
                  {c.team} {isMine && "◆"}
                </div>
                <div className="flex-1 h-6 bg-white/5 relative overflow-hidden">
                  <div className="h-full flex items-center justify-end pr-2" style={{ width: `${Math.max(pct, 3)}%`, background: `linear-gradient(90deg, ${t.color}, ${t.color}cc)` }}>
                    <span className="display text-xs text-black tabular-nums">{c.points}</span>
                  </div>
                </div>
                <div className="w-12 text-right mono text-xs text-white/50">{pct.toFixed(0)}%</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ConstructorRow({ constructor: c, teamMeta: t, leaderPoints, isMine, myDriverCode, drivers, primary, accent }) {
  const [open, setOpen] = useState(false);
  const pct = (c.points / leaderPoints) * 100;

  return (
    <div
      className="border transition overflow-hidden"
      style={{
        borderColor: isMine ? primary : "rgba(255,255,255,0.1)",
        background: isMine ? hexToRgba(primary, 0.08) : "rgba(0,0,0,0.3)",
      }}
    >
      {/* Always-visible compact row (clickable) */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-white/5 transition"
      >
        <div className="display text-sm text-white/50 w-8">{String(c.pos).padStart(2,"0")}</div>
        <div className="w-1 h-8" style={{ background: t.color }} />
        <div className="flex-1 min-w-0">
          <div className="bebas text-lg truncate" style={{ color: isMine ? primary : "white" }}>
            {c.team} {isMine && "◆"}
          </div>
          <div className="mono text-[10px] text-white/40">{c.wins}W · {c.podiums}P · {pct.toFixed(0)}% of P1</div>
        </div>
        <div className="display text-2xl tabular-nums" style={{ color: t.color }}>{c.points}</div>
        <span className={`inline-block text-white/50 transition-transform ${open ? "rotate-90" : ""}`}>▸</span>
      </button>

      {/* Expanded detail panel */}
      {open && (
        <div className="px-4 pb-4 fade-in border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <div className="mono text-[10px] text-white/40 tracking-widest mb-2">TEAM INFO</div>
              <div className="mono text-xs text-white/70 space-y-1">
                <div>HQ · {t.hq}</div>
                <div>ENGINE · {t.engine}</div>
                <div>FOUNDED · {t.founded}</div>
                <div>TITLES · {t.titles}</div>
              </div>
            </div>
            <div>
              <div className="mono text-[10px] text-white/40 tracking-widest mb-2">2026 STATS</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="border border-white/10 p-2">
                  <div className="mono text-[9px] text-white/40">WINS</div>
                  <div className="bebas text-xl">{c.wins}</div>
                </div>
                <div className="border border-white/10 p-2">
                  <div className="mono text-[9px] text-white/40">PODIUMS</div>
                  <div className="bebas text-xl">{c.podiums}</div>
                </div>
              </div>
            </div>
            <div>
              <div className="mono text-[10px] text-white/40 tracking-widest mb-2">LINEUP</div>
              {c.drivers.map(code => {
                const d = drivers.find(dr => dr.code === code);
                return (
                  <div key={code} className="flex items-center justify-between py-1" style={{ color: code === myDriverCode ? accent : "white" }}>
                    <span className="bebas text-sm">#{d.number} {d.last.toUpperCase()}{code === myDriverCode && " ◆"}</span>
                    <span className="mono text-xs text-white/60">P{d.pos} · {d.points} pts</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RaceCard({ race, myDriver, driverCode, teamName, drivers, primary, accent }) {
  const [open, setOpen] = useState(false);
  const myFinish = race.results[driverCode];

  // Build sorted top-10 from race results
  const sortedResults = Object.entries(race.results)
    .map(([code, pos]) => ({ code, pos }))
    .sort((a, b) => {
      if (typeof a.pos !== "number") return 1;
      if (typeof b.pos !== "number") return -1;
      return a.pos - b.pos;
    });

  return (
    <div className="border border-white/10 bg-black/40 overflow-hidden hover:border-white/30 transition">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-4 hover:bg-white/5 transition"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="mono text-[10px] text-white/40">RD {String(race.round).padStart(2,"0")} · {race.date}</div>
          <div className="flex items-center gap-2">
            {race.sprint && <span className="mono text-[10px] px-1.5 py-0.5 border" style={{ borderColor: accent, color: accent }}>SPRINT</span>}
            <span className={`inline-block text-white/50 transition-transform ${open ? "rotate-90" : ""}`}>▸</span>
          </div>
        </div>
        <div className="bebas text-2xl leading-tight">{race.flag} {race.name}</div>
        <div className="mono text-[10px] text-white/40 mt-1">{race.circuit}</div>

        <div className="mt-4 space-y-1">
          {race.podium.map((code, i) => {
            const medal = ["#FFD700","#C0C0C0","#CD7F32"][i];
            const dr = drivers.find(d => d.code === code);
            return (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="display text-lg" style={{ color: medal }}>{i+1}</span>
                <span className="bebas" style={{ color: dr?.team === teamName ? primary : "white" }}>
                  {dr?.last || code}
                </span>
                {code === driverCode && <span style={{ color: accent }}>◆</span>}
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="mono text-[10px] text-white/40">{myDriver.last.toUpperCase()}</div>
          <div className="bebas text-xl" style={{ color: typeof myFinish === "number" && myFinish <= 3 ? accent : "white" }}>
            {typeof myFinish === "number" ? `P${myFinish}` : myFinish || "—"}
          </div>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 fade-in border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="mono text-[10px] text-white/40 tracking-widest mt-3 mb-2">FULL RESULTS</div>
          <div className="space-y-1">
            {sortedResults.map(({ code, pos }) => {
              const dr = drivers.find(d => d.code === code);
              if (!dr) return null;
              const isMine = code === driverCode;
              const isMyTeam = dr.team === teamName;
              return (
                <div
                  key={code}
                  className="grid grid-cols-[30px_1fr_auto] items-center gap-2 px-2 py-1 text-sm"
                  style={{
                    background: isMine ? hexToRgba(accent, 0.15) : isMyTeam ? hexToRgba(primary, 0.08) : "transparent",
                    borderLeft: isMine ? `2px solid ${accent}` : "none",
                    paddingLeft: isMine ? "6px" : "8px",
                  }}
                >
                  <span className="display text-xs" style={{ color: typeof pos === "number" && pos <= 3 ? "#FFD700" : "white" }}>
                    {typeof pos === "number" ? `P${pos}` : pos}
                  </span>
                  <span className="bebas truncate" style={{ color: isMine ? accent : "white" }}>
                    #{dr.number} {dr.last.toUpperCase()}{isMine && " ◆"}
                  </span>
                  <span className="mono text-[10px] text-white/50">{dr.team}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
