import { z } from "zod";

const scientistSchema = z.array(
	z.object({
		id: z.number({ message: "Id should be a number" }),
		name: z.string(),
		nationality: z.string(),
		description: z.string(),
		date_of_birth: z
			.string()
			.date("Date should follow the format of YYYY-MM-DD"),
		date_of_death: z
			.string()
			.date("Date should follow the format of YYYY-MM-DD")
			.nullable(),
		discoveries: z.array(
			z.string({ message: "Array items should be strings" }),
		),
		nobel_prize: z
			.array(
				z.object({
					category: z.string(),
					year: z.number().gte(1901, {
						message: "Nobel prizes started being awarded in the year 1901",
					}),
					study: z.string(),
				}),
			)
			.nullable(),
		other_awards: z.array(z.string()).nullable(),
	}),
);

export const scientistsData = [
	// Aage Bohr
	{
		id: 1,
		name: "Aage N Bohr",
		nationality: "Danish",
		description:
			"Aage Bohr was awarded the Nobel Prize in Physics in 1975 for his work detailing the structure of the atomic nucleus",
		date_of_birth: "1922-06-19",
		date_of_death: "2009-09-08",
		discoveries: ["Detailing the structure of the atomic nucleus"],
		nobel_prize: [
			{
				category: "Physics",
				year: 1975,
				study: "Detailing the structure of the atomic nucleus",
			},
		],
		other_awards: null,
	},

	// Abdus Salam
	{
		id: 2,
		name: "Abdus Salam",
		nationality: "Indian",
		description: "was a Pakistani theoretical physicist",
		date_of_birth: "1926-01-29",
		date_of_death: "1996-11-21",
		discoveries: [
			"Electroweak theory",
			"Goldstone boson",
			"Grand Unified Theory",
			"Higgs mechanism",
			"Magnetic photon",
			"Neutral current",
			"Pati–Salam model",
			"Quantum mechanics",
			"Pakistan atomic research program",
			"Pakistan space program",
			"Preon",
			"Standard Model",
			"Strong gravity",
			"Superfield",
			"W and Z bosons",
		],
		nobel_prize: null,
		other_awards: [
			"Smith's Prize (1950)",
			"Adams Prize (1958)",
			"Sitara-e-Pakistan (1959)",
			"Hughes Medal (1964)",
			"Atoms for Peace Prize (1968)",
			"Royal Medal (1978)",
			"Matteucci Medal (1978)",
			"Nobel Prize in Physics (1979)",
			"Nishan-e-Imtiaz (1979)",
			"Lomonosov Gold Medal (1983)",
			"Copley Medal (1990)",
		],
	},

	// Albert Einstein
	{
		id: 3,
		name: "Albert Einstein",
		nationality: "German",
		description:
			"German-born theoretical physicist who is widely held as one of the most influential scientists. Best known for developing the theory of relativity",
		date_of_birth: "1879-03-14",
		date_of_death: "1955-04-18",
		discoveries: [
			"General relativity and the equivalence principle",
			"Provided powerful evidence that atoms and molecules actually exist, through his analysis of Brownian motion",
			"Explained the photoelectric effect",
			"Hole argument and Entwurf theory",
			"Gravitational waves",
			"Wormholes",
			"Special relativity",
			"Unified field theory",
			"Equations of motion",
			"Bose–Einstein statistics",
			"Wave–particle duality",
			"Quantum mechanics",
			"Bose–Einstein condensate",
			"EPR paradox",
			"E=hf (Planck–Einstein relation)",
			"E=mc2 (mass–energy equivalence)",
			"Rewrote the law of gravitation:  showed that matter causes space to curve, which produces gravity",
		],
		nobel_prize: [
			{
				category: "Physics",
				year: 1921,
				study: "discovery of the law of the photoelectric effect",
			},
		],
		other_awards: [
			"Copley medal (1925)",
			"Max Planck Medal (1929)",
			"Barnard Medal for Meritorious Service to Science (1920)",
			"Matteucci Medal (1921)",
			"ForMemRS (1921)",
			"Gold Medal of RAS (1926)",
			"Time Person of the Century (1999)",
			"Membership of NAS (1942)",
		],
	},

	// Alessandro Volta
	{
		id: 4,
		name: "Alessandro Giuseppe Antonio Anastasio Volta",
		nationality: "Italian",
		description:
			"was an Italian physicist and chemist who was a pioneer of electricity and power",
		date_of_birth: "1745-02-18",
		date_of_death: "1827-03-05",
		discoveries: [
			"Invention of the electric cell",
			"Discovery of methane",
			"Law of capacitance",
			"Volt",
			"Voltage",
			"Voltmeter",
			"Volta potential",
			"Volta pistol",
			"Voltaic pile",
		],
		nobel_prize: null,
		other_awards: [
			"ForMemRS (1791)",
			"Copley Medal (1794)",
			"Legion of Honour (1805)",
			"Order of the Iron Crown (1806)",
		],
	},

	// Alhazen -> BC ERA
	// {
	//     id: 5,
	//     name: "Alhazen Ibn al-Haytham",
	//     nationality: "Egyptian",
	//     description: "About Alhazen",
	//     date_of_birth: "1745-02-18",
	//     date_of_death: "1827-03-05",
	//     discoveries: [],
	//     nobel_prize: [],
	//     other_awards: []
	// },

	// Amedeo Avogadro
	{
		id: 5,
		name: "Lorenzo Romano Amedeo Carlo Avogadro",
		nationality: "Italian",
		description:
			"was an Italian scientist, most noted for his contribution to molecular theory now known as Avogadro's law, which states that equal volumes of gases under the same conditions of temperature and pressure will contain equal numbers of molecules.",
		date_of_birth: "1776-08-09",
		date_of_death: "1856-07-09",
		discoveries: ["Avogadro's constant", "Avogadro's law"],
		nobel_prize: null,
		other_awards: null,
	},

	// Anaximander
	// {
	//     id: 7,
	//     name: "Anaximander",
	//     nationality: "Turkish",
	//     description: "About Anaximander",
	//     date_of_birth: "1776-08-09",
	//     date_of_death: "1856-07-09",
	//     discoveries: [],
	//     nobel_prize: [],
	//     other_awards: []
	// },

	// Andre-Marie Ampere
	{
		id: 6,
		name: "André-Marie Ampère",
		nationality: "French",
		description:
			"was a French physicist and mathematician who was one of the founders of the science of classical electromagnetism, which he referred to as electrodynamics",
		date_of_birth: "1775-01-20",
		date_of_death: "1836-06-10",
		discoveries: [
			"Ampère's circuital law",
			"Ampère's force law",
			"Ampère's right hand grip rule",
			"Ampèrian loop model",
			"Avogadro-Ampère hypothesis",
			"Monge–Ampère equation",
			"Discovery of fluorine",
			"Needle telegraph",
			"Solenoid",
		],
		nobel_prize: null,
		other_awards: ["FRS (1827)"],
	},

	// Archimedes
	// {
	//     id: 9,
	//     name: "Archimedes",
	//     nationality: "Italian",
	//     description: "About Archimedes",
	//     date_of_birth: "1775-01-20",
	//     date_of_death: "1836-06-10",
	//     discoveries: [],
	//     nobel_prize: [],
	//     other_awards: []
	// },

	// Aristotle
	// {
	//     id: 10,
	//     name: "Aristotle",
	//     nationality: "Greek",
	//     description: "About Aristotle",
	//     date_of_birth: "1775-01-20",
	//     date_of_death: "1836-06-10",
	//     discoveries: [],
	//     nobel_prize: [],
	//     other_awards: []
	// },

	// Arthur Compton
	{
		id: 7,
		name: "Arthur Holly Compton",
		nationality: "U.S",
		description:
			"American physicist who won the Nobel Prize in Physics in 1927 for his 1923 discovery of the Compton effect, which demonstrated the particle nature of electromagnetic radiation.",
		date_of_birth: "1892-09-10",
		date_of_death: "1962-03-15",
		discoveries: [
			"Compton scattering",
			"Compton wavelength",
			"Compton–Getting effect",
			"Compton generator",
		],
		nobel_prize: [
			{
				category: "Physics",
				year: 1927,
				study: "description",
			},
		],
		other_awards: [
			"Matteucci Medal (1930)",
			"Franklin Medal (1940)",
			"Hughes Medal (1940)",
			"Medal for Merit (1946)",
		],
	},

	// Benjamin Franklin
	{
		id: 8,
		name: "Benjamin Franklin",
		nationality: "U.S",
		description:
			" was an American polymath: a leading writer, scientist, inventor, statesman, diplomat, printer, publisher and political philosopher.",
		date_of_birth: "1705-01-17",
		date_of_death: "1790-04-17",
		discoveries: [
			"He invented the Bifocal Spectacles",
			"The Franklin Stove",
			"The Lightning Rod",
			"Shaping our understanding of electricity",
			"Refrigeration",
			"Founded the American Philosophical Society",
		],
		nobel_prize: null,
		other_awards: null,
	},

	// Bernhard Riemann
	{
		id: 9,
		name: "Georg Friedrich Bernhard Riemann",
		nationality: "German",
		description:
			"was a German mathematician who made profound contributions to analysis, number theory, and differential geometry.",
		date_of_birth: "1826-09-17",
		date_of_death: "1866-07-20",
		discoveries: [
			"Free Riemann gas also called primon gas",
			"Riemann invariant",
			"Riemann–Cartan geometry",
			"Riemann–Silberstein vector",
			"Riemann-Lebovitz formulation",
			"Riemann curvature tensor also called Riemann tensor",
			"Riemann tensor (general relativity)",
		],
		nobel_prize: null,
		other_awards: null,
	},

	// Blaise Pascal
	{
		id: 10,
		name: "Blaise Pascal",
		nationality: "French",
		description:
			"French mathematician, physicist, inventor, philosopher, and Catholic writer.",
		date_of_birth: "1623-06-19",
		date_of_death: "1662-08-19",
		discoveries: [
			"Probability theory",
			"Pascal distribution",
			"Pascal's wager",
			"Pascal's triangle",
			"Pascal's law",
			"Pascal's rule",
			"Pascal's theorem",
			"Pascal's calculator",
		],
		nobel_prize: null,
		other_awards: null,
	},

	// Brian Greene
	{
		id: 11,
		name: "Brian Randolph Greene",
		nationality: "American",
		description: "American physicist known for his research on string theory",
		date_of_birth: "1963-02-09",
		date_of_death: null,
		discoveries: [
			"String theory",
			"The Elegant Universe",
			"The Fabric of the Cosmos",
			"The Hidden Reality",
		],
		nobel_prize: null,
		other_awards: ["Andrew Gemant Award (2003)"],
	},

	// C.V. Raman
	{
		id: 12,
		name: "Sir Chandrasekhara Venkata Raman",
		nationality: "Indian",
		description:
			"Indian physicist known for his work in the field of light scattering.",
		date_of_birth: "1888-11-07",
		date_of_death: "1970-11-21",
		discoveries: ["Raman scattering (Raman effect)", "Raman spectroscopy"],
		nobel_prize: [
			{
				category: "Physics",
				year: 1930,
				study: "Raman effect or Raman scattering",
			},
		],
		other_awards: [
			"Fellow of the Royal Society (1924)",
			"Matteucci Medal (1928)",
			"Knight Bachelor (1930)",
			"Hughes Medal (1930)",
			"Bharat Ratna (1954)",
			"Lenin Peace Prize (1957)",
		],
	},

	// Carl Anderson
	{
		id: 13,
		name: "Carl David Anderson",
		nationality: "U.S",
		description:
			"He is best known for his discovery of the positron in 1932, an achievement for which he received the 1936 Nobel Prize in Physics, and of the muon in 1936",
		date_of_birth: "1905-09-03",
		date_of_death: "1991-01-11",
		discoveries: [
			"Carl Anderson discovered the positron in 1932, proving the existence of antimatter",
			"He discovered the muon in 1936",
		],
		nobel_prize: [
			{
				category: "Physics",
				year: 1936,
				study: "Raman effect or Raman scattering",
			},
		],
		other_awards: ["Elliott Cresson Medal (1937)"],
	},

	// Carl Friedrich Gauss
	{
		id: 14,
		name: "Carl Friedrich Gauss",
		nationality: "German",
		description:
			"Was a German mathematician, generally regarded as one of the greatest mathematicians of all time.",
		date_of_birth: "1777-04-30",
		date_of_death: "1855-02-23",
		discoveries: [
			"Geometry",
			"Number theory",
			"Probability theory",
			"Geodesy",
			"Known for Construction of the Heptadecagon",
			"Number Theory",
			"discoveries of the Dwarf Planet Ceres",
			"Disquisitiones Arithmeticae: Investigations in Arithmetic",
			"Inventing the Heliotrope, The Magnetic Field and SI Units",
			"The Telegraph",
			"Kirchoff’s Circuit Laws",
			"Gauss’s Law & Gauss’s Law for Magnetism",
			"Gauss’s incredible calculating power allowed him to find patterns in numbers more readily than most mathematicians. It enabled him to discover the prime number theorem when he was a teenager",
			"The normal distribution/bell curve is often called the Gaussian distribution, because Gauss discovered it",
			"Although not the first person to use complex numbers, he defined them, establishing the modern notation, and he applied complex numbers to solve problems in science",
			"He opened up the field of differential geometry and published the Theorema Egregium, relating surface curvature to distances and angles.",
		],
		nobel_prize: null,
		other_awards: ["Copley Medal (1838)"],
	},

	// Charles Barkla
	{
		id: 15,
		name: "Charles Glover Barkla",
		nationality: "English",
		description: "About Charles Glover Barkla",
		date_of_birth: "1877-06-07",
		date_of_death: "1944-10-23",
		discoveries: [
			"Known for Construction of the Heptadecagon",
			"Number Theory",
			"discoveries of the Dwarf Planet Ceres",
			"Disquisitiones Arithmeticae: Investigations in Arithmetic",
			"Inventing the Heliotrope, The Magnetic Field and SI Units",
			"The Telegraph",
			"Kirchoff’s Circuit Laws",
			"Gauss’s Law & Gauss’s Law for Magnetism",
			"Gauss’s incredible calculating power allowed him to find patterns in numbers more readily than most mathematicians. It enabled him to discover the prime number theorem when he was a teenager",
			"The normal distribution/bell curve is often called the Gaussian distribution, because Gauss discovered it",
			"Although not the first person to use complex numbers, he defined them, establishing the modern notation, and he applied complex numbers to solve problems in science",
			"He opened up the field of differential geometry and published the Theorema Egregium, relating surface curvature to distances and angles.",
		],
		nobel_prize: null,
		other_awards: null,
	},

	// Charles Townes
	{
		id: 16,
		name: "Charles Hard Townes",
		nationality: "American",
		description: "About Charles Hard Townes",
		date_of_birth: "1915-07-28",
		date_of_death: "2015-01-27",
		discoveries: [
			"Masers",
			"Lasers",
			"Astrophysical maser",
			"Infrared Spatial",
			"Interferometer",
			"Stimulated Brillouin scattering",
			"Townes-Schawlow linewidth",
			"Townes Solution",
			"Autler–Townes effect",
		],
		nobel_prize: [
			{
				category: "Physics",
				year: 1964,
				study:
					"Contributions to fundamental work in quantum electronics leading to the development of the maser and laser.",
			},
		],
		other_awards: [
			"Comstock Prize in Awards Physics (1958)",
			"John J. Carty Award (1961)",
			"Stuart Ballantine (1962)",
			"Young Medal and Prize (1963)",
			"IEEE Medal of Honor (1967)",
			"Wilhelm Exner Medal (1970)",
			"ForMemRS (1976)",
			"Earle K. Plyler Prize for Molecular Spectroscopy (1977)",
			"National Medal of Science (1982)",
			"Lomonosov Gold Medal (2000)",
			"Templeton Prize (2005)",
			"Vannevar Bush Award (2006)",
			"SPIE Gold Medal (2010)",
			"Golden Goose Award (2012)",
		],
	},

	// Chen Ning Yang
	{
		id: 17,
		name: "Yang Chen-Ning",
		nationality: "Chinese",
		description:
			"Also known as C. N. Yang or by the English name Frank Yang, is a Chinese theoretical physicist who made significant contributions to statistical mechanics, integrable systems, gauge theory, and both particle physics and condensed matter physics",
		date_of_birth: "1922-10-01",
		date_of_death: null,
		discoveries: ["placeholder discoveries"],
		nobel_prize: [
			{
				category: "Physics",
				year: 1957,
				study: "Parity violation theory",
			},
		],
		other_awards: [
			"Ten Outstanding Young Americans (1957)",
			"Rumford Prize (1980)",
			"National Medal of Science (1986)",
			"Oskar Klein Memorial Lecture and Medal (1988)",
			"Benjamin Franklin Medal for Distinguished Achievement in the Sciences of the American",
			"Philosophical Society (1993)",
			"Bower Award (1994)",
			"Albert Einstein Medal (1995)",
			"Lars Onsager Prize (1999)",
			"King Faisal International Prize (2001)",
		],
	},

	// Chien-Shiung Wu
	{
		id: 18,
		name: "Chien-Shiung Wu",
		nationality: "Chinese",
		description:
			"Chinese-American particle and experimental physicist who made significant contributions in the fields of nuclear and particle physics",
		date_of_birth: "1912-05-31",
		date_of_death: "1997-02-16",
		discoveries: [
			"Manhattan Project",
			"Nuclear fission",
			"Wu experiment",
			"Parity violation",
			"Beta decay",
			"Quantum entanglement",
		],
		nobel_prize: null,
		other_awards: [
			"Comstock Prize in Physics (1964)",
			"Bonner Prize (1975)",
			"National Medal of Science (1975)",
			"Wolf Prize in Physics (1978)",
		],
	},

	// Daniel Bernoulli
	{
		id: 19,
		name: "Daniel Bernoulli",
		nationality: "Swiss",
		description:
			"Most distinguished of the second generation of the Bernoulli family os Swiss mathematicians.",
		date_of_birth: "1700-02-08",
		date_of_death: "1782-03-17",
		discoveries: [
			"Put forward Bernoulli's principle",
			"Established the basis for the kinetic theory of gases.",
			"He wrote Exercitationes quaedam Mathematicae on differential equations and the physics of flowing water",
			"Researched properties of vibrating and rotating bodies and contributed to probability theory",
		],
		nobel_prize: null,
		other_awards: ["10 Prizes from Paris Academy of Sciences"],
	},

	// David Gross
	{
		id: 20,
		name: "David Gross",
		nationality: "U.S",
		description:
			"Graduted from Hebrew University of Jerusalem in 1962 and received a Ph.D in physics from University of California.",
		date_of_birth: "1941-02-19",
		date_of_death: null,
		discoveries: [
			"Did research in supestring theory and coinventor of a new supestring model in 1987",
			"Quantum Chromodynamics (QCD)",
		],
		nobel_prize: [
			{
				category: "Physics",
				year: 2004,
				study:
					"Together with David Politzer and Frank Wilczek discovered strong force - nuclear force that binds together quarks(the smallest building blocks of matter) and hold together the nucleus of the atom.",
			},
		],
		other_awards: [
			"Numerous awards from a MacArthur Foundation fellowship (1987)",
		],
	},

	// David Hilbert
	{
		id: 21,
		name: "David Hilbert",
		nationality: "German",
		description:
			"German mathematician who reduced geometry to a series of axioms and contributed to the establishment of the formalistic foundations of mathematics.",
		date_of_birth: "1862-01-23",
		date_of_death: "1943-02-14",
		discoveries: [
			"His work in integral equations led to research in functional analysis",
			"Hilbert’s Basis Theorem of Proof",
			"Hilbert’s Axioms of Geometry",
			"Hilbert’s 23 research Problems",
			"Hilbert space",
			"The Gravitational Field Equations of General Relativity",
			"Hilbert Space and Hilbert’s Program: Logic and the Foundation of Mathematics",
		],
		nobel_prize: null,
		other_awards: null,
	},

	// // Democritus
	// {
	//     "id": 26,
	//     "name": "Democritus",
	//     "description": "lkdjhbvnwndbmsncldjfbcj",
	//     "nationality": "Ancient Greek city of Abdera.",
	//     "date_of_birth": 460,
	//     "date_of_death": 370,
	//     "discoveries": [
	//         "He is famous for his atomic theory featuring tiny particles always in motion interacting through collisions",
	//         "His belief that the universe is governed entirely by natural, mechanistic laws rather than gods",
	//         "His description of a universe containing an infinity of diverse inhabited worlds",
	//         "His assertion that nothing is actually something",
	//         "His deduction that the light of stars explains the Milky Way’s appearance",
	//         "His discoveries that a cone’s volume is one-third that of the cylinder with the same base and height"
	//     ]
	// },

	// Amalie Emmy Noether
	{
		id: 22,
		name: "Amalie Emmy Noether",
		nationality: "German",
		description:
			"German mathematician whose innovations in higher algebra gained her recognition as the most creative abstract algebraist of modern times",
		date_of_birth: "1882-03-23",
		date_of_death: "1935-04-14",
		discoveries: [
			"Discovered that if Lagrangian does not change when the coordinate system changes, then there is quantity that is conserved",
			"Noether's Theorem",
			"Built up the theory of noncommutative algebras",
		],
		nobel_prize: null,
		other_awards: null,
	},

	// Enrico Fermi
	{
		id: 23,
		name: "Enrico Fermi",
		nationality: "Italian",
		description:
			"Was an Italian born American scientist who was one of the chief architects of the nuclear age.",
		date_of_birth: "1901-09-29",
		date_of_death: "1954-11-28",
		discoveries: [
			"He developed the mathematical statistics required to clarify a large class of subatomic phenomena",
			"Explored nuclear transformations caused by neutrons, and directed the first controlled chain reaction",
			"Fermi-Dirac Statistics",
			"Fermi paradox (Where is everybody)",
			"Nuclear chain reaction",
		],
		nobel_prize: [
			{
				category: "Physics",
				year: 1938,
				study: "Nuclear chain reaction",
			},
		],
		other_awards: null,
	},

	// Ernest Orlando Lawrence
	{
		id: 24,
		name: "Ernest Orlando Lawrence",
		nationality: "U.S",
		description:
			"Was an American phycist who invented the cyclotron, the first particle accelerator",
		date_of_birth: "1901-08-08",
		date_of_death: "1958-08-27",
		discoveries: [
			"Invented the first particle accelerator",
			"Invented and patented a colour-television picture tube",
			"Worked on the Manhattan Project as program chief in charge of the development of the electromagnetic process separating uranium-235 for the atomic bomb",
		],
		nobel_prize: [
			{
				category: "Physics",
				year: 1939,
				study: "Invention of the cyclotron",
			},
		],
		other_awards: ["Award from U.S Atomic Energy Commission (1957)"],
	},

	// Ernest Rutherford
	{
		id: 25,
		name: "Ernest Rutherford",
		nationality: "New Zealand",
		description:
			"He was a New Zeland-born British physicist considered the greatest experimentalist since Michael Faraday.",
		date_of_birth: "1871-08-30",
		date_of_death: "1937-10-19",
		discoveries: [
			"Atomic nucleus",
			"Artificial Disintegration",
			"Radioactivity",
			"Rutherford model",
			"Alpha, Beta, and Gamma Radiation",
			"Radioactive Half-Lives",
		],
		nobel_prize: [
			{
				category: "Chemistry",
				year: 1908,
				study: "Radioactivity",
			},
		],
		other_awards: ["Copley Medal (1922)"],
	},

	// Ernest Walton
	{
		id: 26,
		name: "Ernest Walton",
		nationality: "Ireland",
		description:
			"He is best known for his work with John Cockcroft to construct one of the earliest types of particle accelerator",
		date_of_birth: "1903-10-06",
		date_of_death: "1995-06-25",
		discoveries: [
			"Cockcroft–Walton generator.",
			"Splitting the atom",
			"Credited with being the first to disintegrate the lithium nucleus by bombardment with accelerated protons",
			"Identifying helium nuclei in the products in 1930",
		],
		nobel_prize: [
			{
				category: "Physics",
				year: 1951,
				study: "Splitting the atom",
			},
		],
		other_awards: ["Hughes Medal (1938)", "MRIA (1935)"],
	},

	// Erwin Schrodinger
	{
		id: 27,
		name: "Erwin Rudolf Josef Alexander Schrodinger",
		nationality: "Austrian",
		description: "Recognized for postulating the Schrodinger equation.",
		date_of_birth: "1887-08-12",
		date_of_death: "1961-01-04",
		discoveries: [
			"Schrodinger equation",
			"Shrodinger's cat",
			"Cat state",
			"Schrodinger method",
			"Schrodinger group",
			"Schrodinger picture",
			"Schrodinger field",
			"Rayleigh-Schrodinger pertubation",
			"Robertson-Schrodinger uncertainty relations",
			"Schrodinger-HJW theorem",
			"Schrodinger's pure-affine theory",
			"Coherent states",
			"Energy level",
			"Entropy and life",
			"Negentropy",
			"Interpretations of quantum mechanics",
			"Qualia",
			"Quantum Biology",
			"Quantum Entanglement",
			"Quantum Superposition",
			"Quantum Steering",
			"Zitterbewegung",
		],
		nobel_prize: [
			{
				category: "Physics",
				year: 1933,
				study: "Formulation of Schrodinger equation",
			},
		],
		other_awards: [
			"Haitinger Prize (1920)",
			"Matteucci Medal (1927)",
			"Max Planck Medal (1937)",
			"Erwin Schrodinger Prize (1956)",
			"Honorary membership of the Royal irish Academy (1931)",
		],
	},

	// Evangelista Torricelli
	{
		id: 28,
		name: "Evangelista Torricelli",
		nationality: "Italian",
		description:
			"An Italian physicist and mathematician and a student of Galileo.",
		date_of_birth: "1608-10-15",
		date_of_death: "1647-10-25",
		discoveries: [
			"Suction pumps and the Barometer",
			"Torricelli's experiment",
			"Torricelli's equation",
			"Torricelli's law regarding the speed of fluid flowing out an opening",
			"Torricelli's trumpet aka Gabriel's Trumpet",
			"Torricellian vaccum",
			"Cause of the wind",
		],
		nobel_prize: null,
		other_awards: [
			"Statue of Torricelli in gratitude to him (1868)",
			"Asteroid 7437 Torricelli and a crater on the moon named in his honour",
			"Genus of flowering plants named after him (1830)",
		],
	},

	// Francis Crick
	{
		id: 29,
		name: "Francis Harry Compton Crick",
		nationality: "British",
		description:
			"An English molecular biologist, biophysicist and neuroscientist",
		date_of_birth: "1916-06-08",
		date_of_death: "2004-07-28",
		discoveries: [
			"DNA structure",
			"Central dogma",
			"Consciousness",
			"Adaptor hypothesis",
		],
		nobel_prize: [
			{
				category: "Physiology/Medicine",
				year: 1962,
				study: "DNA structure",
			},
		],
		other_awards: [
			"Albert Lasker Award (1960)",
			"Gairdner Foundation International Award (1962)",
			"Mendel Medal (1966)",
			"Royal Medal (1972)",
			"Copley Medal (1972)",
			"Sir Hans Krebs Medal (1977)",
			"Albert Medal (1987)",
			"Golden Plate Award (1987)",
			"Order of Merit (1991)",
		],
	},

	// Frank Wilczek
	{
		id: 30,
		name: "Frank Wilczek",
		nationality: "U.S",
		description:
			"Contributed to the study of questions relating to cosmology, condensed matter physics and blackholes",
		date_of_birth: "1951-05-15",
		date_of_death: null,
		discoveries: [
			"Did research in supestring theory and coinventor of a new supestring model in 1987",
			"Quantum Chromodynamics (QCD)",
		],
		nobel_prize: [
			{
				category: "Physics",
				year: 2004,
				study:
					"Together with David J.Gross and H. David Politzer discovered strong force - nuclear force that binds together quarks(the smallest building blocks of matter) and hold together the nucleus of the atom.",
			},
		],
		other_awards: [
			"MacArthur Foundation fellowship (1982)",
			"Trempleton Prize(2022)",
		],
	},

	// Fred Hoyle
	{
		id: 31,
		name: "Sir Fred Hoyle",
		nationality: "British",
		description:
			"Was an English astronomer who formulated the thoery of stellar nucleosynthesis",
		date_of_birth: "1915-06-24",
		date_of_death: "2001-08-20",
		discoveries: [
			"Coining th phrase 'Big Bang",
			"Steady-state-theory",
			"Stellar nucleosynthesis theory",
			"Triple-Alpha process",
			"Panspermia",
			"Hoyle's fallacy",
			"Hoyle's model",
			"B2FH Paper",
			"Hoyle-Narlikar theory",
			"Bondi-Hoyle-Lyttleton",
			"Accretion",
		],
		nobel_prize: [
			{
				category: "Physics",
				year: 1974,
				study: "Leading role in the discovery of pulsars",
			},
			{
				category: "Physics",
				year: 1983,
				study:
					"THeoretical and experimental studies of the nuclear reactions of importance in the formation of the chemical elements in the universe",
			},
		],
		other_awards: [
			"Gold Medal of the Royal Astronomical Society (1968)",
			"Bakerian Lecture (1968)",
			"Bruce Medal (1970)",
			"Henry Norris Russell Lectureship (1971)",
			"Knighthood (1972)",
			"Royal Medal (1974)",
			"Klumpke-Roberts Award (1977)",
			"Balzan Prize (1994)",
			"Crafoord Prize (1997)",
		],
	},

	// Galileo Galilei
	{
		id: 32,
		name: "Galileo di Vincenzo Bonaiuti de' Galilei",
		nationality: "Italian",
		description:
			"commonly referred to as Galileo Galilei  or mononymously as Galileo, was an Italian (Florentine)[a] astronomer, physicist and engineer,sometimes described as a polymath",
		date_of_birth: "1564-02-15",
		date_of_death: "1642-01-08",
		discoveries: [
			"Celatone",
			"Analytical dynamics",
			"Frictionless plane",
			"Galileo number",
			"Galileo thermometer",
			"Galileo's ship",
			"Galileo's escapement",
			"Galileo's experiment",
			"Galileo's law of odd numbers",
			"Galileo's objective lens",
			"Galileo's paradox",
			"Galileo's problem",
			"Galileo's sector",
			"Galilean equivalency principle",
			"Galilean invariance",
			"Galilean moons",
			"Galilean telescope",
			"Galilean transformation",
			"Heliocentrism",
			"Inertia",
			"Pendulum clock",
			"Phases of Venus",
			"Rings of Saturn",
			"Square-cube law",
		],
		nobel_prize: null,
		other_awards: null,
	},

	// Georg Ohm
	{
		id: 33,
		name: "Georg Simon Ohm",
		nationality: "German",
		description: "German physicist and mathematician",
		date_of_birth: "1789-03-16",
		date_of_death: "1854-07-06",
		discoveries: ["Ohm's law", "Ohm's accoustic law", "Ohm"],
		nobel_prize: null,
		other_awards: ["Copley medal (1841)"],
	},

	// Guglielmo Marconi
	{
		id: 34,
		name: "Guglielmo Marconi",
		nationality: "Italian",
		description:
			"Worked on the development of shortwave wireless communication.",
		date_of_birth: "1874-04-25",
		date_of_death: "1937-07-20",
		discoveries: ["Radiotelegraphy"],
		nobel_prize: [
			{
				category: "Physics",
				year: 1909,
				study: "Hertzian wave",
			},
		],
		other_awards: null,
	},

	// Hans Bethe
	{
		id: 35,
		name: "Hans Albrecht Bethe",
		nationality: "German-American",
		description:
			"He was a theoretical physicist who made major contributions to nuclear physics, astrophysics, quantum electrodynamics, and solid-state physics",
		date_of_birth: "1906-07-02",
		date_of_death: "2005-03-06",
		discoveries: [
			"Nuclear physics",
			"Stellar nucleosynthesis",
			"Quantum electrodynamics",
			"Cavity perturbation theory",
			"Crystal field theory",
			"Bethe–Salpeter equation",
			"Bethe-Slater curve",
			"Bethe formula",
			"Bethe-Heitler formula",
			"Mott-Bethe formula",
			"Bethe lattice",
			"Bethe–Feynman formula",
			"Bethe ansatz",
			"Bethe–Weizsäcker formula",
			"Bethe–Weizsäcker process",
		],
		nobel_prize: [
			{
				category: "Physics",
				year: 1967,
				study: "theory of stellar nucleosynthesis",
			},
		],
		other_awards: [
			"A. Cressy Morrison Prize (1939)",
			"Henry Draper Medal (1947)",
			"Franklin Medal (1959)",
			"Eddington Medal (1961)",
			"Enrico Fermi Award (1961)",
			"Rumford Prize (1963)",
			"Nat'l Medal of Science (1975)",
			"Lomonosov Gold Medal (1989)",
			"Oersted Medal (1993)",
			"Bruce Medal (2001)",
			"Benjamin Franklin Medal (2005)",
		],
	},

	// Hans Christian Ørsted
	{
		id: 36,
		name: "Hans Christian Ørsted",
		nationality: "Danish",
		description:
			"A Danish physicist and chemist who discovered that electric currents create magnetic fields",
		date_of_birth: "1777-08-14",
		date_of_death: "1851-03-09",
		discoveries: [
			"Oersted's law",
			"Discovery of aluminium",
			"Thought experiment Oersted",
		],
		nobel_prize: null,
		other_awards: [
			"Copley Medal (1820)",
			"ForMemRS (1821)",
			"FRSE (1821)",
			"Pour le Mérite (1842)",
		],
	},

	// Heinrich Hertz
	{
		id: 42,
		name: "Heinrich Rudolf Hertz",
		nationality: "German",
		description:
			"German physicist who first conclusively proved the existence of the electromagnetic waves",
		date_of_birth: "1857-02-22",
		date_of_death: "1894-01-01",
		discoveries: [
			"Hertzian wave",
			"Contact mechanics",
			"Emagram",
			"Parabollic antenna",
			"Photoelectric effect",
			"Hertzian cone",
			"Hertzian dipole antenna",
			"Hertzian oscillator",
			"Hertzian vector",
			"Hertzian-Knudsen equation",
			"Hertz's principle of least curvature",
		],
		nobel_prize: null,
		other_awards: ["Matteucci Medal Awards (1888)", "Rumford Medal (1890)"],
	},

	// Henry Moseley
	{
		id: 43,
		name: "Henry Gwyn Jeffreys Moseley",
		nationality: "English",
		description:
			"Physicist whose contribution to the science of physics was the justification from physical laws of\n" +
			"the previous empirical and chemical concept of the atomic number",
		date_of_birth: "1887-11-23",
		date_of_death: "1915-08-10",
		discoveries: ["Atomic number", "Moseley's law"],
		nobel_prize: null,
		other_awards: ["Matteucci Medal (1919)"],
	},

	// Inge Lehmann
	{
		id: 44,
		name: "Inge Lehmann",
		nationality: "Danish",
		description:
			"Danish seismologist and geophysicist who is known for her discovery in 1936 of the solid inner core that exists within the molten outer core of the Earth.",
		date_of_birth: "1888-05-13",
		date_of_death: "1993-02-21",
		discoveries: ["Discovery of a solid inner core in earths crust"],
		nobel_prize: null,
		other_awards: ["William Bowie Medal (1971)"],
	},

	// Irene Joliot-Curie
	{
		id: 45,
		name: "Irène Joliot-Curie",
		nationality: "French",
		description:
			"French chemist, physicist and politician, the elder daughter of Pierre Curie and Marie Skłodowska–Curie, and the wife of Frédéric Joliot-Curie.",
		date_of_birth: "1897-09-12",
		date_of_death: "1956-03-17",
		discoveries: ["Discovery of induced radioactivity"],
		nobel_prize: [
			{
				category: "Chemistry",
				year: 1935,
				study: "Discovery of induced radioactivity",
			},
		],
		other_awards: null,
	},

	// Isaac Newton
	{
		id: 46,
		name: "Sir Isaac Newton",
		nationality: "English",
		description:
			"English polymath active as a mathematician, physicist, astronomer, alchemist, theologian, and author who was described in his time as a natural philosopher.",
		date_of_birth: "1642-10-25",
		date_of_death: "1726-03-20",
		discoveries: [
			"Newton's laws of motion",
			"Newtonian mechanics",
			"Gravitional forces",
			"Calculus",
			"Optics",
			"Binomial Series",
			"Newton's method",
			"Principia",
			"Newton's law of cooling",
			"Newtonian identities",
			"Newton's metal",
			"Newton line",
			"Newton-Gauss Line",
			"Newtonian fluid",
		],
		nobel_prize: null,
		other_awards: ["FRS (1672)", "Bachelor (1705)"],
	},

	// J. J. Thompson
	{
		id: 47,
		name: "Sir Joseph John Thomson",
		nationality: "British",
		description:
			"British physicist and Nobel Laureate in Physics, credited with the discovery of the electron",
		date_of_birth: "1856-12-18",
		date_of_death: "1940-08-30",
		discoveries: [
			"Plum pudding model",
			"Discovery of electron",
			"Discovery of isotopes",
			"Mass spectrometer invention",
			"Electromagnetic mass",
			"First m/e measurement",
			"Proposed first waveguide",
			"Gibbs–Thomson equation",
			"Thomson scattering",
			"Thomson problem",
			"Coining term 'delta ray",
			"Coining term 'epsilon radiation'",
			"Thomson (unit)",
		],
		nobel_prize: [
			{
				category: "Physics",
				year: 1906,
				study: "Conduction of electricity in gases",
			},
		],
		other_awards: [
			"Smith's Prize (1880)",
			"Royal Medal (1894)",
			"Hughes Medal (1902)",
			"Elliott Cresson Medal (1910)",
			"Copley Medal (1914)",
			"Albert Medal (1915)",
			"Franklin Medal (1922)",
			"Faraday Medal (1925)",
			"Dalton Medal (1931)",
		],
	},

	// J. Robert Oppenheimer
	{
		id: 48,
		name: "Julius Robert Oppenheimer",
		nationality: "American",
		description:
			"American theoretical physicist who served as the director of the Manhattan Project's Los Alamos Laboratory during World War II. Also know as father of the atomic bomb",
		date_of_birth: "1904-04-22",
		date_of_death: "1967-02-18",
		discoveries: [
			"Atomic bomb",
			"Oppenheimer–Snyder model",
			"Tolman–Oppenheimer–Volkoff equation",
			"Tolman–Oppenheimer–Volkoff limit",
			"Oppenheimer–Phillips process",
			"Born–Oppenheimer approximation",
		],
		nobel_prize: null,
		other_awards: ["Medal for Merit (1946)", "Enrico Fermi Award (1963)"],
	},

	// James Chadwick
	{
		id: 49,
		name: "Sir James Chadwick",
		nationality: "American",
		description:
			"English physicist who was awarded the 1935 Nobel Prize in Physics for his discovery of the neutron in 1932",
		date_of_birth: "1891-10-20",
		date_of_death: "1974-07-24",
		discoveries: [
			"Discovery of the neutron",
			"MAUD Committee Report",
			"Manhattan Project",
		],
		nobel_prize: [
			{
				category: "Physics",
				year: 1935,
				study: "Discovery of the neutron",
			},
		],
		other_awards: [
			"Fellow of the Royal Society (1927)",
			"Hughes Medal (1932)",
			"Knight Bachelor (1945)",
			"Melchett Medal (1946)",
			"Copley Medal (1950)",
			"Faraday Medal (1950)",
			"Franklin Medal (1951)",
			"Guthrie Medal and Prize (1967)",
			"Member of the Order of the Companions of Honour (1970)",
		],
	},

	// James Clerk Maxwell
	{
		id: 50,
		name: "James Clerk Maxwell",
		nationality: "Scottish",
		description:
			"Scottish physicist and mathematician who was responsible for the classical theory of electromagnetic radiation",
		date_of_birth: "1831-06-13",
		date_of_death: "1879-11-05",
		discoveries: [
			"Electromagnetism",
			"Colour vision",
			"Kinetic theory and thermodynamics",
			"Control theory",
		],
		nobel_prize: null,
		other_awards: [
			"Smith's Prize (1854)",
			"Adams Prize (1857)",
			"Rumford Medal (1860)",
			"FRS (1861)",
			"Bakerian Medal (1866)",
			"Keith Medal (1869–1871)",
		],
	},

	// Johannes Kepler
	{
		id: 51,
		name: "Johannes Kepler",
		nationality: "German",
		description:
			"He is a key figure in the 17th-century Scientific Revolution, best known for his laws of planetary motion",
		date_of_birth: "1571-12-27",
		date_of_death: "1630-11-15",
		discoveries: [
			"Kepler's laws of planetary motion",
			"Kepler conjecture",
			"Rudolphine Tables",
			"Astronomia Nova",
			"Mysterium Cosmographicum",
			"Harmonice Mundi",
		],
		nobel_prize: null,
		other_awards: null,
	},

	// John Bardeen
	{
		id: 52,
		name: "John Bardeen",
		nationality: "American",
		description:
			"He is the only person to be awarded the Nobel Prize in Physics twice: first in 1956 with William Shockley and Walter Brattain for the invention of the transistor; and again in 1972 with Leon N. Cooper and John Robert Schrieffer for a fundamental theory of conventional superconductivity known as the BCS theory.",
		date_of_birth: "1908-05-23",
		date_of_death: "1991-01-30",
		discoveries: [
			"Point-contact transistor",
			"Field-effect transistor",
			"BCS theory",
			"Superconductivity",
			"Surface physics",
			"Deformation potential theory",
			"Bardeen's formalism",
			"Mattis–Bardeen theory",
		],
		nobel_prize: [
			{
				category: "Physics",
				year: 1956,
				study: "Invention of the transistor",
			},
			{
				category: "Physics",
				year: 1972,
				study: "BCS theory.",
			},
		],
		other_awards: [
			"Stuart Ballantine medal (1952)",
			"Oliver E. Buckley Solid State Prize (1954)",
			"Fritz London Memorial Prize (1962)",
			"National Medal of Science (1965)",
			"IEEE Medal of Honor (1971)",
			"ForMemRS (1973)",
			"Franklin Medal (1975)",
			"Lomonosov Gold Medal (1987)",
		],
	},

	// John Cockcroft
	// {
	//     "id": 53,
	//     "name": "John Cockcroft",
	//     "description": "This is a description for Isaac Newton",
	//     "nationality": "Todmorden, Yorkshire, England, UK",
	//     "date_of_birth": 1897,
	//     "date_of_death": 1967,
	//     "discoveries": [
	//         "Won the 1951 Nobel Prize in Physics with his colleague Ernest Walton for producing the first artificial nuclear disintegration in history",
	//         "Cockcroft & Walton designed and built the first ‘high energy’ particle accelerator",
	//         "As a remarkable side-benefit, their experiment provided proof that Einstein’s mass-energy equivalence equation E = mc2 is correct",
	//     ]
	// },

	// John Michell
	// {
	//     "id": 54,
	//     "name": "John Michell",
	//     "description": "This is a description for Isaac Newton",
	//     "nationality": " Eakring, Nottinghamshire, England, UK",
	//     "date_of_birth": 1724,
	//     "date_of_death": 1793,
	//     "discoveries": [
	//         "Made the first explicit statement that the force between two magnets is governed by an inverse square law",
	//         "Suggested that black holes – he called them dark stars – could exist, proposing their masses could be so great that light could not escape from them",
	//         "Proposed that earthquakes are caused by the movement of rocks miles below our planet’s surface and travel long distances as waves",
	//         "Invented the torsion balance, allowing our planet’s mass to be determined for the first time",
	//         "Used probability analysis to show that some star clusters, such as the Pleiades, are non-random, suggesting they are held together by gravity",
	//         "Invented a method to produce cheap, permanent magnets artificially"
	//     ]
	// },

	// John Philoponus
	// {
	//     "id": 55,
	//     "name": "John Philoponus",
	//     "description": "This is a description for Isaac Newton",
	//     "nationality": "Weil der Stadt, which then lay in the Holy Roman Empire, and is now in Germany",
	//     "date_of_birth": 490,
	//     "date_of_death": 570,
	//     "discoveries": [
	//         "Made the first explicit statement that the force between two magnets is governed by an inverse square law",
	//         "Suggested that black holes – he called them dark stars – could exist, proposing their masses could be so great that light could not escape from them",
	//         "Proposed that earthquakes are caused by the movement of rocks miles below our planet’s surface and travel long distances as waves",
	//         "Invented the torsion balance, allowing our planet’s mass to be determined for the first time",
	//         "Used probability analysis to show that some star clusters, such as the Pleiades, are non-random, suggesting they are held together by gravity",
	//         "Invented a method to produce cheap, permanent magnets artificially"
	//     ]
	// },

	// John Wallis
	// {
	//     "id": 56,
	//     "name": "John Wallis",
	//     "description": "This is a description for Isaac Newton",
	//     "nationality": "Weil der Stadt, which then lay in the Holy Roman Empire, and is now in Germany",
	//     "date_of_birth": 1616,
	//     "date_of_death": 1703,
	//     "discoveries": [
	//         "Made the first explicit statement that the force between two magnets is governed by an inverse square law",
	//         "Suggested that black holes – he called them dark stars – could exist, proposing their masses could be so great that light could not escape from them",
	//         "Proposed that earthquakes are caused by the movement of rocks miles below our planet’s surface and travel long distances as waves",
	//         "Invented the torsion balance, allowing our planet’s mass to be determined for the first time",
	//         "Used probability analysis to show that some star clusters, such as the Pleiades, are non-random, suggesting they are held together by gravity",
	//         "Invented a method to produce cheap, permanent magnets artificially"
	//     ]
	// },

	// Joseph Henry
	// {
	//     "id": 57,
	//     "name": "Joseph Henry",
	//     "description": "This is a description for Isaac Newton",
	//     "nationality": "Albany, New York, USA",
	//     "date_of_birth": 1797,
	//     "date_of_death": 1878,
	//     "discoveries": [
	//         "Using a magnet to produce electricity",
	//         "Inductance and the The Telegraph"
	//     ]
	// },

	// Joseph-Louis Lagrange
	// {
	//     "id": 58,
	//     "name": "Joseph-Louis Lagrange",
	//     "description": "This is a description for Isaac Newton",
	//     "nationality": "Italian city of Turin, Piedmont",
	//     "date_of_birth": 1736,
	//     "date_of_death": 1813,
	//     "discoveries": [
	//         "Built on earlier work by Leonhard Euler to create the calculus of variations – he called it his ‘method of variations’",
	//         "Introduced the ∂ notation and created the first partial differential equations",
	//         "Gave the most generalized statement of the principle of least action of his era",
	//         "Created an entirely new field of mechanics, Lagrangian mechanics, for both solids and fluids, based on the concept of virtual work and utilizing the Lagrangian function",
	//         "Introduced the concept of generalized coordinates",
	//         " Lagrangian mechanics can be used in any coordinate system – problems are simplified by choosing an appropriate one",
	//         "Created the concept of potential: the gravitational field, for example, is a potential field",
	//         "Discovered Lagrangian orbits",
	//         "Solved century-old problems in number theory posed by Fermat that had defeated other mathematicians",
	//         "Was a founder of group theory",
	//         "Played a key role in the creation of the metric system of weights and measures",
	//         "Tidal Locking & Libration of the Moon, Partial Differential Equations",
	//         "Lagrangian Mechanics"
	//     ]
	// },

	// Kip Thorne
	//  {
	//     "id": 59,
	//     "name": "Kip Thorne",
	//     "description": "This is a description for Isaac Newton",
	//     "nationality": "Weil der Stadt, which then lay in the Holy Roman Empire, and is now in Germany",
	//     "date_of_birth": 1736,
	//     "date_of_death": 1813,
	//     "discoveries": [
	//         "Built on earlier work by Leonhard Euler to create the calculus of variations – he called it his ‘method of variations’",
	//         "Introduced the ∂ notation and created the first partial differential equations",
	//         "Gave the most generalized statement of the principle of least action of his era",
	//         "Created an entirely new field of mechanics, Lagrangian mechanics, for both solids and fluids, based on the concept of virtual work and utilizing the Lagrangian function",
	//         "Introduced the concept of generalized coordinates",
	//         " Lagrangian mechanics can be used in any coordinate system – problems are simplified by choosing an appropriate one",
	//         "Created the concept of potential: the gravitational field, for example, is a potential field",
	//         "Discovered Lagrangian orbits",
	//         "Solved century-old problems in number theory posed by Fermat that had defeated other mathematicians",
	//         "Was a founder of group theory",
	//         "Played a key role in the creation of the metric system of weights and measures",
	//         "Tidal Locking & Libration of the Moon, Partial Differential Equations",
	//         "Lagrangian Mechanics"
	//     ]
	// },

	// Lawrence Bragg
	// {
	//     "id": 60,
	//     "name": "Lawrence Bragg",
	//     "description": "This is a description for Isaac Newton",
	//     "nationality": "Adelaide, capital of the British colony of South Australia",
	//     "date_of_birth": 1890,
	//     "date_of_death": 1971,
	//     "discoveries": [
	//         "He discovered how to ‘see’ the positions of atoms in solids",
	//         "His discoveries has had an enormous impact on chemistry, biology, and mineralogy",
	//         "Bragg showed how X-rays passing through a crystal collect information allowing the crystal’s atomic structure to be deduced"
	//     ]
	// },

	// Lisa Randall
	// {
	//     "id": 61,
	//     "name": "Lisa Randall",
	//     "description": "This is a description for Isaac Newton",
	//     "nationality": "Adelaide, capital of the British colony of South Australia",
	//     "date_of_birth": 1890,
	//     "date_of_death": 1971,
	//     "discoveries": [
	//         "He discovered how to ‘see’ the positions of atoms in solids",
	//         "His discoveries has had an enormous impact on chemistry, biology, and mineralogy",
	//         "Bragg showed how X-rays passing through a crystal collect information allowing the crystal’s atomic structure to be deduced"
	//     ]
	// },

	// Lise Meitner
	// {
	//     "id": 62,
	//     "name": "Lise Meitner",
	//     "description": "This is a description for Isaac Newton",
	//     "nationality": "Vienna, capital of the Austro-Hungarian Empire",
	//     "date_of_birth": 1878,
	//     "date_of_death": 1968,
	//     "discoveries": [
	//         "New Isotopes and Radioactive Recoil",
	//         "Swashbuckling Science",
	//         "Protactinium’s Long-lived Isotope",
	//         "Nuclear Fission",
	//         "The Mother of the Atom Bomb"
	//     ]
	// },

	// Lord Kelvin
	// {
	//     "id": 63,
	//     "name": "Lord Kelvin",
	//     "description": "This is a description for Isaac Newton",
	//     "nationality": "Vienna, capital of the Austro-Hungarian Empire",
	//     "date_of_birth": 1824,
	//     "date_of_death": 1907,
	//     "discoveries": [
	//         "New Isotopes and Radioactive Recoil",
	//         "Swashbuckling Science",
	//         "Protactinium’s Long-lived Isotope",
	//         "Nuclear Fission",
	//         "The Mother of the Atom Bomb"
	//     ]
	// },

	// Luis Alvarez
	// {
	//     "id": 64,
	//     "name": "Luis Alvarez",
	//     "description": "This is a description for Isaac Newton",
	//     "nationality": "San Francisco, California",
	//     "date_of_birth": 1911,
	//     "date_of_death": 1988,
	//     "discoveries": [
	//         "The iridium layer",
	//         "Dinosaur death by meteorite impact",
	//         "Subatomic particle discoveries"
	//     ]
	// },

	// Marie Curie
	// {
	//     "id": 65,
	//     "name": "Marie Curie",
	//     "description": "Description  for Marie Curie",
	//     "nationality": "Warsaw, Poland",
	//     "date_of_birth": 1867,
	//     "date_of_death": 1934,
	//     "discoveries": [
	//         "Marie Curie discovered two new chemical elements: radium and polonium",
	//         "She carried out the first research into the treatment of tumors with radiation",
	//         "She founded of the Curie Institutes, which are important medical research centers"
	//     ]
	// },

	// Masatoshi Koshiba
	// {
	//     "id": 66,
	//     "name": "Masatoshi Koshiba",
	//     "description": "Description  for Marie Curie",
	//     "nationality": "Warsaw, Poland",
	//     "date_of_birth": 1926,
	//     "date_of_death": 2020,
	//     "discoveries": [
	//         "Marie Curie discovered two new chemical elements: radium and polonium",
	//         "She carried out the first research into the treatment of tumors with radiation",
	//         "She founded of the Curie Institutes, which are important medical research centers"
	//     ]
	// },

	// Max Born
	// {
	//     "id": 67,
	//     "name": "Max Born",
	//     "description": "Description  for Marie Curie",
	//     "nationality": "Warsaw, Poland",
	//     "date_of_birth": 1882,
	//     "date_of_death": 1970,
	//     "discoveries": [
	//         "Marie Curie discovered two new chemical elements: radium and polonium",
	//         "She carried out the first research into the treatment of tumors with radiation",
	//         "She founded of the Curie Institutes, which are important medical research centers"
	//     ]
	// },

	// Max Planck
	// {
	//     "id": 68,
	//     "name": "Max Planck",
	//     "description": "Was a German theoretical physicist who originated quantum theory.",
	//     "nationality": "Kiel, Schleswig [Germany]",
	//     "awards_and_honors": ["Copley Medal (1929)", "Nobel Prize (1918)"],
	//     "date_of_birth": 1858,
	//     "date_of_death": 1947,
	//     "discoveries": [
	//         "Planck\n's constant",
	//         "Planck\n's radiation law",
	//         "Quantum theory",
	//         "Black body radiation"
	//     ]
	// },

	// Michael Faraday
	// {
	//     "id": 69,
	//     "name": "Michael Faraday",
	//     "description": "Description for Michael Faraday",
	//     "nationality": "London, England, UK",
	//     "date_of_birth": 1791,
	//     "date_of_death": 1867,
	//     "discoveries": [
	//         "discoveries of Electromagnetic Rotation",
	//         "Gas Liquefaction and Refrigeration",
	//         "Benzene",
	//         "Electromagnetic Induction, Faraday’s Laws of Electrolysis",
	//         "Invention of the Faraday Cage and Faraday Effect: a magneto-optical effect"
	//     ]
	// },

	// Michio Kaku
	// {
	//     "id": 70,
	//     "name": "Michio Kaku",
	//     "description": "Description for Michael Faraday",
	//     "nationality": " San Jose, California",
	//     "date_of_birth": 1947,
	//     "date_of_death": 186766,
	//     "discoveries": [
	//         "Popularizer of science"
	//     ]
	// },

	// Murray Gell-Mann
	// {
	//     "id": 71,
	//     "name": "Murray Gell-Mann",
	//     "description": "Description for Michael Faraday",
	//     "nationality": "London, England, UK.",
	//     "date_of_birth": 1929,
	//     "date_of_death": 2019,
	//     "discoveries": [
	//         "Popularizer of science"
	//     ]
	// },

	// Nicolo Tartaglia
	// {
	//     "id": 72,
	//     "name": "Nicolo Tartaglia",
	//     "description": "Description for Michael Faraday",
	//     "nationality": "London, England, UK.",
	//     "date_of_birth": 1500,
	//     "date_of_death": 1557,
	//    "discoveries": [
	//             "Popularizer of science"
	//     ]
	// },

	// Neils Bohr
	// {
	//     "id": 73,
	//     "name": "Neils Bohr",
	//     "description": "Denmark’s capital city, Copenhagen",
	//     "nationality": "Denmark’s capital city, Copenhagen",
	//     "date_of_birth": 1885,
	//     "date_of_death": 1962,
	//    "discoveries": [
	//             "He founded quantum mechanics",
	//             "Later, as a leading architect of the Copenhagen interpretation of quantum mechanics, he helped to reshape our understanding of how nature operates at the atomic scale"
	//     ]
	// },

	// Nikola Tesla
	// {
	//     "id": 74,
	//     "name": "Nikola Tesla",
	//     "description": "Denmark’s capital city, Copenhagen",
	//     "nationality": "London, England, UK.",
	//     "date_of_birth": 1856,
	//     "date_of_death": 1943,
	//     "discoveries": [
	//             "He founded quantum mechanics",
	//             "Later, as a leading architect of the Copenhagen interpretation of quantum mechanics, he helped to reshape our understanding of how nature operates at the atomic scale"
	//     ]
	// },

	// Paul Dirac
	// {
	//    "id": 75,
	//    "name": "Paul Dirac",
	//    "description": "Denmark’s capital city, Copenhagen",
	//    "nationality": "Bristol, England, UK",
	//    "date_of_birth": 1902,
	//    "date_of_death": 1984,
	//    "discoveries": [
	//             "Dirac founded quantum electrodynamics",
	//             "Accounting for the creation and annihilation of photons of light within atoms, and his Lagrangian formulation of quantum mechanics led to Richard Feynman’s path integrals"
	//     ]
	// },

	// Pyotr Kapitsa
	// {
	//     "id": 76,
	//     "name": "Pyotr Kapitsa",
	//     "description": "Denmark’s capital city, Copenhagen",
	//     "nationality": "Kronstadt, an island fortress near Saint Petersburg, capital of the Russian Empire",
	//     "date_of_birth": 1894,
	//     "date_of_death": 1984,
	//     "discoveries": [
	//              "discoveries of Superfluidity"
	//      ]
	//  },

	// Richard A. Muller
	// {
	//     "id": 77,
	//     "name": "Richard A. Muller",
	//     "description": "Denmark’s capital city, Copenhagen",
	//     "nationality": "Kronstadt, an island fortress near Saint Petersburg, capital of the Russian Empire",
	//     "date_of_birth": 1894,
	//     "date_of_death": 1984,
	//     "discoveries": [
	//              "discoveries of Superfluidity"
	//      ]
	//  },

	// Richard Feynman
	// {
	//     "id": 78,
	//     "name": "Richard Feynman",
	//     "description": "Denmark’s capital city, Copenhagen",
	//     "nationality": "Kronstadt, an island fortress near Saint Petersburg, capital of the Russian Empire",
	//     "date_of_birth": 1918,
	//     "date_of_death": 1988,
	//     "discoveries": [
	//              "discoveries of Superfluidity"
	//      ]
	//  },

	// Robert Hooke
	// {
	//     "id": 79,
	//     "name": "Robert Hooke",
	//     "description": "Denmark’s capital city, Copenhagen",
	//     "nationality": "Isle of Wight, England",
	//     "date_of_birth": 1635,
	//     "date_of_death": 1703,
	//     "discoveries": [
	//              "The Measurement of Time",
	//              "Hooke’s Law",
	//              "Micrographia and Microscopy",
	//              "Micrographia and Paleontology",
	//              "The Force of Gravity"
	//      ]
	//  },

	// Rodger Penrose
	// {
	//     "id": 80,
	//     "name": "Rodger Penrose",
	//     "description": "Denmark’s capital city, Copenhagen",
	//     "nationality": "Isle of Wight, England",
	//     "date_of_birth": 1635,
	//     "date_of_death": 1703,
	//     "discoveries": [
	//              "The Measurement of Time",
	//              "Hooke’s Law",
	//              "Micrographia and Microscopy",
	//              "Micrographia and Paleontology",
	//              "The Force of Gravity"
	//      ]
	//  },

	// S. N. Bose
	// {
	//     "id": 81,
	//     "name": "S. N. Bose",
	//     "description": "Denmark’s capital city, Copenhagen",
	//     "nationality": "British India’s capital city, Calcutta, Bengal Presidency. Today the city is known as Kolkata, located in the Indian state of West Bengal",
	//     "date_of_birth": 1635,
	//     "date_of_death": 1974,
	//     "discoveries": [
	//              "S. N. Bose founded quantum statistics in 1924 when he discovered a new way to derive Planck’s radiation law"
	//      ]
	//  },

	// Stephen Hawking
	// {
	//     "id": 82,
	//     "name": "Stephen Hawking",
	//     "description": "Denmark’s capital city, Copenhagen",
	//     "nationality": "British India’s capital city, Calcutta, Bengal Presidency. Today the city is known as Kolkata, located in the Indian state of West Bengal",
	//     "date_of_birth": 1942,
	//     "date_of_death": 2018,
	//     "discoveries": [
	//              "S. N. Bose founded quantum statistics in 1924 when he discovered a new way to derive Planck’s radiation law"
	//      ]
	//  },

	// Steven Weinberg
	// {
	//     "id": 83,
	//     "name": "Steven Weinberg",
	//     "description": "Denmark’s capital city, Copenhagen",
	//     "nationality": "British India’s capital city, Calcutta, Bengal Presidency. Today the city is known as Kolkata, located in the Indian state of West Bengal",
	//     "date_of_birth": 1933,
	//     "date_of_death": 2021,
	//     "discoveries": [
	//              "S. N. Bose founded quantum statistics in 1924 when he discovered a new way to derive Planck’s radiation law"
	//      ]
	//  },

	// SUBRAHMANYAN CHANDRASEKHAR
	// {
	//     "id": 84,
	//     "name": "SUBRAHMANYAN CHANDRASEKHAR",
	//     "description": "Denmark’s capital city, Copenhagen",
	//     "nationality": "Lahore, British India. (Lahore is now in Pakistan.)",
	//     "date_of_birth": 1910,
	//     "date_of_death": 1995,
	//     "discoveries": [
	//              "He was an astrophysicist",
	//              "He discovered that massive stars can collapse under their own gravity to reach enormous or even infinite densities. Today we call these collapsed stars neutron stars and black holes"
	//      ]
	//  },

	// Thomas Young
	// {
	//     "id": 85,
	//     "name": "Thomas Young",
	//     "description": "Denmark’s capital city, Copenhagen",
	//     "nationality": "Lahore, British India. (Lahore is now in Pakistan.)",
	//     "date_of_birth": 1773,
	//     "date_of_death": 1829,
	//     "discoveries": [
	//              "Subrahmanyan Chandrasekhar was an astrophysicist",
	//              "He discovered that massive stars can collapse under their own gravity to reach enormous or even infinite densities. Today we call these collapsed stars neutron stars and black holes"
	//      ]
	//  },

	// Vera Rubin
	// {
	//     "id": 86,
	//     "name": "Vera Rubin",
	//     "description": "Denmark’s capital city, Copenhagen",
	//     "nationality": "Lahore, British India. (Lahore is now in Pakistan.)",
	//     "date_of_birth": 1928,
	//     "date_of_death": 2016,
	//     "discoveries": [
	//              "Subrahmanyan Chandrasekhar was an astrophysicist",
	//              "He discovered that massive stars can collapse under their own gravity to reach enormous or even infinite densities. Today we call these collapsed stars neutron stars and black holes"
	//      ]
	//  },

	// Werner Karl Heisenberg
	// {
	//     "id": 87,
	//     "name": "Werner Karl Heisenberg",
	//     "description": "Was a German physicist and philosopher who discovered a way to formulate quantum mechanics in terms of matrices",
	//     "nationality": "Wurzburg, Germany",
	//     "awards_and_honors": ["Nobel prize (1932)"],
	//     "date_of_birth": 1901,
	//     "date_of_death": 1976,
	//     "discoveries": [
	//              "complementarity principle",
	//              "matrix mechanics",
	//              "uncertainty principle"
	//      ]
	//  },

	// J. Willard Gibbs
	// {
	//     "id": 88,
	//     "name": "J. Willard Gibbs",
	//     "description": "Denmark’s capital city, Copenhagen",
	//     "nationality": "New Haven, Connecticut, USA",
	//     "date_of_birth": 1839,
	//     "date_of_death": 1903,
	//     "discoveries": [
	//              "He contributed to Thermodynamics",
	//              "Discovered The Phase Rule",
	//              "Gibbs’ Thermodynamics on a Stamp",
	//              "Vector Analysis – A New Branch of Mathematics and Statistical Mechanics"
	//      ]
	//  },

	// William Gilbert
	// {
	//     "id": 89,
	//     "name": "William Gilbert",
	//     "description": "Denmark’s capital city, Copenhagen",
	//     "nationality": "Colchester, England",
	//     "date_of_birth": 1544,
	//     "date_of_death": 1603,
	//     "discoveries": [
	//              "The Earth’s Interior is Magnetic",
	//              "He observed that static electricity is generated by friction, but magnetism exists independently of friction",
	//              "He discovered The First Electroscope, Using Earth’s Magnetism to Make Magnets, Recognizing that Magnetism is Caused by Internal Order"
	//      ]
	//  },

	// Wolfgang Pauli
	// {
	//     "id": 90,
	//     "name": "Wolfgang Pauli",
	//     "description": "Denmark’s capital city, Copenhagen",
	//     "nationality": "Colchester, England",
	//     "date_of_birth": 1900,
	//     "date_of_death": 1958,
	//     "discoveries": [
	//              "The Earth’s Interior is Magnetic",
	//              "He observed that static electricity is generated by friction, but magnetism exists independently of friction",
	//              "He discovered The First Electroscope, Using Earth’s Magnetism to Make Magnets, Recognizing that Magnetism is Caused by Internal Order"
	//      ]
	//  },

	// Herman Von Helmholtz
	// {
	//     "id": 91,
	//     "name": "Herman Von Helmholtz",
	//     "description": "Was a German physicist and philosopher. Best known for his statement of the law of conservation of energy",
	//     "nationality": "Postdam, Prussia [Germany]",
	//     "awards_honors": [""],
	//     "date_of_birth": 1821,
	//     "date_of_death": 1894,
	//     "discoveries": [
	//              "physiology",
	//              "optics",
	//              "electrodynamics",
	//              "mathematics",
	//              "meteorology"
	//      ]
	//  },

	// Joseph Black
	// {
	//     "id": 92,
	//     "name": "Joseph Black",
	//     "description": "Was a british chemist and physicist best known for the rediscoveries of fixed air (carbon dioxide).",
	//     "nationality": "Bordeaux, France",
	//     "awards_honors": [""],
	//     "date_of_birth": 1728,
	//     "date_of_death": 1799,
	//     "discoveries": [
	//              "latent heat",
	//              "bicarbonate",
	//              "carbon dioxide"
	//      ]
	//  },
];

scientistSchema.parse(scientistsData);
