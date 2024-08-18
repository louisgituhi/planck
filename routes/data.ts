import { z } from "zod";

const physicistSchema = z.array(
    z.object({
        id: z.number(),
        name: z.string(),
        nationality: z.string(),
        description: z.string(),
        date_of_birth: z.string().date(),
        date_of_death: z.string().date().nullable(),
        discoveries: z.array(z.string()),
        nobel_prize: z.array(z.object({
            category: z.string(),
            year: z.number().gte(1901, { message: "Nobel prizes started being awarded in the year 1901" }),
            study: z.string()
        })).nullable(),
        other_awards: z.array(z.string()).nullable()
    })
);

/////////////////////////////////////////////////////////////////////////////////////////////////////
// contributing
// 1. Each new object must have an Id following the current order 1, 2, 3 and so on
// 2. Currently physicists in the BC era are not supported ie Aristotle etc
// 3. For date_of_birth follow the format YYYY-MM-DD otherwise zod throws an error
// 4. For default values in other_awards, nobel_prize or date of death (some are alive) use null 
/////////////////////////////////////////////////////////////////////////////////////////////////////


export const physicistsData = [

    // Aage Bohr 
    {
        id: 1,
        name: "Aage N Bohr",
        nationality: "Danish",
        description: "Aage Bohr was awarded the Nobel Prize in Physics in 1975 for his work detailing the structure of the atomic nucleus",
        date_of_birth: "1922-06-19",
        date_of_death: "2009-09-08",
        discoveries: ["Detailing the structure of the atomic nucleus"],
        nobel_prize: [
            {
                category: "Physics",
                year: 1975,
                study: "Detailing the structure of the atomic nucleus"
            }
        ],
        other_awards: null
    },

    // Abdus Salam
    {
        id: 2,
        name: "Abdus Salam",
        nationality: "Indian",
        description: "About Abdus Salam",
        date_of_birth: "1879-03-14",
        date_of_death: "1996-11-21",
        discoveries: ["placeholder discovery"],
        nobel_prize: null,
        other_awards: null
    },

    // Albert Einstein
    {
        id: 3,
        name: "Albert Einstein",
        nationality: "German",
        description: "A very short description about Albert Einstein",
        date_of_birth: "1879-03-14",
        date_of_death: "1955-04-18",
        discoveries: [
            "Theory of relativity and the resulting E = mc2",
            "Provided powerful evidence that atoms and molecules actually exist, through his analysis of Brownian motion",
            "Explained the photoelectric effect",
            "Rewrote the law of gravitation:  showed that matter causes space to curve, which produces gravity"
        ],
        nobel_prize: [
            {
                category: "Physics",
                year: 1921,
                study: ";jdhvhfejbhwkefygjwhbejfbwebjhbfjgwjefbhjwf"
            }
        ],
        other_awards: [
            "Copley medal (1925)"
        ]
    },

    // Alessandro Volta
    {
        id: 4,
        name: "Alessandro Volta",
        nationality: "Italian",
        description: "About Alessandro Volta",
        date_of_birth: "1745-02-18",
        date_of_death: "1827-03-05",
        discoveries: ["placeholder discovery"],
        nobel_prize: null,
        other_awards: null
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
        name: "Amedeo Avogadro",
        nationality: "Italian",
        description: "About Amedeo Avogadro",
        date_of_birth: "1776-08-09",
        date_of_death: "1856-07-09",
        discoveries: [
            "Best known for his hypothesis that equal volumes of different gases contain an equal number of molecules, provided they are at the same temperature and pressure",
            "Avogadro was also the first scientist to realize that elements could exist in the form of molecules rather than as individual atoms",
        ],
        nobel_prize: null,
        other_awards: null
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
        name: "Andre-Marie Ampere",
        nationality: "French",
        description: "About Andre-Marie Ampere",
        date_of_birth: "1775-01-20",
        date_of_death: "1836-06-10",
        discoveries: [
            "Discovered that wires carrying electric current can attract and repel magnetically; founded electromagnetic theory",
            "Formulated Ampere’s Law of electromagnetism and produced the best definition of electric current of his time"
        ],
        nobel_prize: null,
        other_awards: null
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
        description: "About Arthur Holly Compton",
        date_of_birth: "1892-09-10",
        date_of_death: "1962-03-15",
        discoveries: [
            "Discovered that light can behave as a particle as well as a wave, and he coined the word 'photon' to describe this newly identified particle of light",
            "Later, with his graduate student Luis Alvarez, Compton showed that cosmic rays contain positively charged particles",
            "During World War 2, Compton played a crucial role in the development of the first atomic bombs"
        ],
        nobel_prize: null,
        other_awards: null
    },

    // Benjamin Franklin
    {
        id: 8,
        name: "Benjamin Franklin",
        nationality: "U.S",
        description: "About Benjamin Franklin",
        date_of_birth: "1706-01-17",
        date_of_death: "1790-04-17",
        discoveries: [
            "He invented the Bifocal Spectacles", 
            "The Franklin Stove", 
            "The Lightning Rod", 
            "Shaping our understanding of electricity", 
            "Refrigeration", 
            "Founded the American Philosophical Society"
        ],
        nobel_prize: null,
        other_awards: null
    },

    // Bernhard Riemann
    {
        id: 9,
        name: "Bernhard Riemann",
        nationality: "Germany",
        description: "About Bernhard Riemann",
        date_of_birth: "1826-09-17",
        date_of_death: "1866-07-20",
        discoveries: ["placeholder discovery"],
        nobel_prize: [],
        other_awards: []
    },
    
    // Blaise Pascal
    {
        id: 10,
        name: "Blaise Pascal",
        nationality: "French",
        description: "About Blaise Pascal",
        date_of_birth: "1623-06-19",
        date_of_death: "1662-08-19",
        discoveries: ["placeholder discovery"],
        nobel_prize: null,
        other_awards: null
    },

    // Brian Greene
    {
        id: 11,
        name: "Brian Greene",
        nationality: "U.S",
        description: "About Brian Greene",
        date_of_birth: "1963-02-09",
        date_of_death: null,
        discoveries: ["placeholder discovery"],
        nobel_prize: null,
        other_awards: null
    },

    // C.V. Raman
    {
        id: 12,
        name: "C.V. Raman",
        nationality: "Indian",
        description: "About C.V. Raman",
        date_of_birth: "1888-11-07",
        date_of_death: "1970-11-21",
        discoveries: ["placeholder discovery"],
        nobel_prize: null,
        other_awards: null
    },

    // Carl Anderson
    {
        id: 13,
        name: "Carl David Anderson",
        nationality: "U.S",
        description: "About Carl David Anderson",
        date_of_birth: "1905-09-03",
        date_of_death: "1991-01-11",
        discoveries: [
            "Carl Anderson discovered the positron in 1932, proving the existence of antimatter",
            "He discovered the muon in 1936"
        ],
        nobel_prize: null,
        other_awards: null
    },

    // Carl Friedrich Gauss
    {
        id: 14,
        name: "Carl Friedrich Gauss",
        nationality: "German",
        description: "Was a German mathematician, generally regarded as one of the greatest mathematicians of all time.",
        date_of_birth: "1777-04-30",
        date_of_death: "1855-02-23",
        discoveries: [
            "Geometry",
            "Number theory",
            "Probability theory",
            "Geodesy",
            "Known for Construction of the Heptadecagon",
            "Number Theory",
            "Discovery of the Dwarf Planet Ceres",
            "Disquisitiones Arithmeticae: Investigations in Arithmetic",
            "Inventing the Heliotrope, The Magnetic Field and SI Units",
            "The Telegraph",
            "Kirchoff’s Circuit Laws",
            "Gauss’s Law & Gauss’s Law for Magnetism",
            "Gauss’s incredible calculating power allowed him to find patterns in numbers more readily than most mathematicians. It enabled him to discover the prime number theorem when he was a teenager",
            "The normal distribution/bell curve is often called the Gaussian distribution, because Gauss discovered it",
            "Although not the first person to use complex numbers, he defined them, establishing the modern notation, and he applied complex numbers to solve problems in science",
            "He opened up the field of differential geometry and published the Theorema Egregium, relating surface curvature to distances and angles."
        ],
        nobel_prize: null,
        other_awards: [
            "Copley Medal (1838)"
        ]
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
            "Discovery of the Dwarf Planet Ceres",
            "Disquisitiones Arithmeticae: Investigations in Arithmetic",
            "Inventing the Heliotrope, The Magnetic Field and SI Units",
            "The Telegraph",
            "Kirchoff’s Circuit Laws",
            "Gauss’s Law & Gauss’s Law for Magnetism",
            "Gauss’s incredible calculating power allowed him to find patterns in numbers more readily than most mathematicians. It enabled him to discover the prime number theorem when he was a teenager",
            "The normal distribution/bell curve is often called the Gaussian distribution, because Gauss discovered it",
            "Although not the first person to use complex numbers, he defined them, establishing the modern notation, and he applied complex numbers to solve problems in science",
            "He opened up the field of differential geometry and published the Theorema Egregium, relating surface curvature to distances and angles."
        ],
        nobel_prize: null,
        other_awards: null
    },

    // Charles Townes
    {
        id: 16,
        name: "Charles Hard Townes",
        nationality: "U.S",
        description: "About Charles Hard Townes",
        date_of_birth: "1915-07-28",
        date_of_death: "2015-01-27",
        discoveries: ["placeholder discovery"],
        nobel_prize: null,
        other_awards: null
    },

    // Chen Ning Yang
    {
        id: 17,
        name: "Chen Ning Yang",
        nationality: "Chinese",
        description: "About Chen Ning Yang",
        date_of_birth: "1922-09-22",
        date_of_death: null,
        discoveries: ["placeholder discovery"],
        nobel_prize: null,
        other_awards: null
    },

    // Chien-Shiung Wu
    {
        id: 18,
        name: "Chien-Shiung Wu",
        nationality: "Chinese",
        description: "About Chien-Shiung Wu",
        date_of_birth: "1912-05-29",
        date_of_death: "1997-02-16",
        discoveries: ["placeholder discovery"],
        nobel_prize: null,
        other_awards: null 
    },

    // Daniel Bernoulli
    // {
    //     "id": 23,
    //     "name": "Daniel Bernoulli",
    //     "description": "lkdjhbvnwndbmsncldjfbcj",
    //     "nationality": "Groningen in the Netherlands",
    //     "year_born": 1700, 
    //     "year_died": 1782,
    //     "discovery": [
    //         "Bernoulli explained how the speed of a fluid affects its pressure: the Bernoulli Effect explains how an airplane’s wings generate lift",
    //         "Bernoulli’s kinetic theory anticipated James Clerk Maxwell’s by more than a century",
    //         "Bernoulli carried out ground-breaking work on the theory of risk, utilized in areas as diverse as economics and evolution",
    //     ]
    // },

    // // David Gross
    // {
    //     "id": 24,
    //     "name": "David Gross",
    //     "description": "lkdjhbvnwndbmsncldjfbcj",
    //     "nationality": "Groningen in the Netherlands",
    //     "year_born": 1700, 
    //     "year_died": 1782,
    //     "discovery": [
    //         "Bernoulli explained how the speed of a fluid affects its pressure: the Bernoulli Effect explains how an airplane’s wings generate lift",
    //         "Bernoulli’s kinetic theory anticipated James Clerk Maxwell’s by more than a century",
    //         "Bernoulli carried out ground-breaking work on the theory of risk, utilized in areas as diverse as economics and evolution",
    //     ]
    // },

    // // David Hilbert
    // {
    //     "id": 25,
    //     "name": "David Hilbert",
    //     "description": "lkdjhbvnwndbmsncldjfbcj",
    //     "nationality": "Königsberg, Prussia, on the Baltic Sea. Königsberg is now called Kaliningrad and is part of Russia.",
    //     "year_born": 1862, 
    //     "year_died": 1943,
    //     "discovery": [
    //         "Hilbert’s Basis Theorem Proof",
    //         "Hilbert’s Axioms of Geometry",
    //         "Hilbert’s 23 Problems",
    //         "The Gravitational Field Equations of General Relativity",
    //         "Hilbert Space and Hilbert’s Program: Logic and the Foundation of Mathematics"
    //     ]
    // },

    // // Democritus
    // {
    //     "id": 26,
    //     "name": "Democritus",
    //     "description": "lkdjhbvnwndbmsncldjfbcj",
    //     "nationality": "Ancient Greek city of Abdera.",
    //     "year_born": 460, 
    //     "year_died": 370,
    //     "discovery": [
    //         "He is famous for his atomic theory featuring tiny particles always in motion interacting through collisions",
    //         "His belief that the universe is governed entirely by natural, mechanistic laws rather than gods",
    //         "His description of a universe containing an infinity of diverse inhabited worlds",
    //         "His assertion that nothing is actually something",
    //         "His deduction that the light of stars explains the Milky Way’s appearance",
    //         "His discovery that a cone’s volume is one-third that of the cylinder with the same base and height"
    //     ]
    // },

    // // Emmy Noether
    // {
    //     "id": 27,
    //     "name": "Emmy Noether",
    //     "description": "lkdjhbvnwndbmsncldjfbcj",
    //     "nationality": "Ancient Greek city of Abdera.",
    //     "year_born": 1882, 
    //     "year_died": 1935,
    //     "discovery": [
    //         "He is famous for his atomic theory featuring tiny particles always in motion interacting through collisions",
    //         "His belief that the universe is governed entirely by natural, mechanistic laws rather than gods",
    //         "His description of a universe containing an infinity of diverse inhabited worlds",
    //         "His assertion that nothing is actually something",
    //         "His deduction that the light of stars explains the Milky Way’s appearance",
    //         "His discovery that a cone’s volume is one-third that of the cylinder with the same base and height"
    //     ]
    // },

    // // Enrico Fermi
    // {
    //     "id": 28,
    //     "name": "Enrico Fermi",
    //     "description": "Italian-born American scientist who was one of the chief architects of the nuclear age.",
    //     "nationality": "Rome, Italy",
    //     "awards_and_honors": ["Nobel prize (1938)"],
    //     "year_born": 1901, 
    //     "year_died": 1954,
    //     "discovery": [
    //         "He is famous for his atomic theory featuring tiny particles always in motion interacting through collisions",
    //         "His belief that the universe is governed entirely by natural, mechanistic laws rather than gods",
    //         "His description of a universe containing an infinity of diverse inhabited worlds",
    //         "His assertion that nothing is actually something",
    //         "His deduction that the light of stars explains the Milky Way’s appearance",
    //         "His discovery that a cone’s volume is one-third that of the cylinder with the same base and height"
    //     ]
    // },

    // // Ernest Lawrence
    // {
    //     "id": 29,
    //     "name": "Ernest Lawrence",
    //     "description": "lkdjhbvnwndbmsncldjfbcj",
    //     "nationality": "Canton, South Dakota, USA",
    //     "year_born": 1901, 
    //     "year_died": 1958,
    //     "discovery": [
    //         "The Cyclotron", 
    //         "Cancer Treatments"
    //     ]
    // },

    // // Ernest Rutherford
    // {
    //     "id": 30,
    //     "name": "Ernest Rutherford",
    //     "description": "He was a New Zeland-born British physicist considered the greatest experimentalist since Michael Faraday.",
    //     "nationality": "Spring Grove, New Zealand",
    //     "awards_and_honors": ["Copley Medal (1922)", "Nobel Prize (1908)"],
    //     "year_born": 1871, 
    //     "year_died": 1937,
    //     "discovery": [
    //         "Atom", 
    //         "Radioactivity",
    //         "Rutherford model"
    //     ]
    // },

    // // Ernest Walton
    // {
    //     "id": 31,
    //     "name": "Ernest Walton",
    //     "description": "lkdjhbvnwndbmsncldjfbcj",
    //     "nationality": "Canton, South Dakota, USA",
    //     "year_born": 1871, 
    //     "year_died": 1937,
    //     "discovery": [
    //         "The Cyclotron", 
    //         "Cancer Treatments"
    //     ]
    // },

    // // Erwin Schrodinger
    // {
    //     "id": 32,
    //     "name": "Erwin Schrodinger",
    //     "description": "lkdjhbvnwndbmsncldjfbcj",
    //     "nationality": "Canton, South Dakota, USA",
    //     "year_born": 1887, 
    //     "year_died": 1961,
    //     "discovery": [
    //         "The Cyclotron", 
    //         "Cancer Treatments"
    //     ]
    // },

    // // Evangelista Torricelli
    // {
    //     "id": 33,
    //     "name": "Evangelista Torricelli",
    //     "description": "lkdjhbvnwndbmsncldjfbcj",
    //     "nationality": "Canton, South Dakota, USA",
    //     "year_born": 1608, 
    //     "year_died": 1647,
    //     "discovery": [
    //         "The Cyclotron", 
    //         "Cancer Treatments"
    //     ]
    // },

    // // Francis Crick
    // {
    //     "id": 34,
    //     "name": "Francis Crick",
    //     "description": "lkdjhbvnwndbmsncldjfbcj",
    //     "nationality": "Canton, South Dakota, USA",
    //     "year_born": 1916, 
    //     "year_died": 2004,
    //     "discovery": [
    //         "The Cyclotron", 
    //         "Cancer Treatments"
    //     ]
    // },

    // // Frank Wilczek
    // {
    //     "id": 35,
    //     "name": "Frank Wilczek",
    //     "description": "lkdjhbvnwndbmsncldjfbcj",
    //     "nationality": "Canton, South Dakota, USA",
    //     "year_born": 1871, 
    //     "year_died": 1937,
    //     "discovery": [
    //         "The Cyclotron", 
    //         "Cancer Treatments"
    //     ]
    // },

    // // Fred Hoyle
    // {
    //     "id": 36,
    //     "name": "Fred Hoyle",
    //     "description": "lkdjhbvnwndbmsncldjfbcj",
    //     "nationality": "Gilstead, England, UK",
    //     "year_born": 1915, 
    //     "year_died": 2001,
    //     "discovery": [
    //         "How the Stars Built the Chemical Elements – Stellar Nucleosynthesis", 
    //         "The Unlikely Existence of Carbon",
    //         "The Age of the Universe, Panspermia"
    //     ]
    // },

    // // Galileo Galilei
    // {
    //     "id": 37,
    //     "name": "Galileo Galilei",
    //     "description": "lkdjhbvnwndbmsncldjfbcj",
    //     "nationality": "Pisa, Italy",
    //     "year_born": 1564, 
    //     "year_died": 1642,
    //     "discovery": [
    //         "Was the first person to study the sky with a telescope",
    //         "Discovered the first moons ever known to orbit a planet other than Earth", 
    //         "Jupiter’s four largest moons, which he discovered: Io, Europa, Ganymede, and Callisto, are together known as the Galilean Satellites in his honor",
    //         "Discovered that Venus has phases like the moon, ranging from a thin crescent to full. This was the first practical, observational evidence that the sun sits at the center of the solar system",
    //         "Discovered the rings of Saturn",
    //         "Discovered our moon has mountains",
    //         "Discovered that the Milky Way is made up of stars",
    //         "Was the first person ever to see the planet Neptune",
    //         "Established that, if there is no air resistance, everything falls to the ground at the same rate regardless of its weight",
    //         " Established that when gravity accelerates any object, the object accelerates at a constant rate"
    //     ]
    // },

    // Georg Ohm
    // {
    //     "id": 38,
    //     "name": "Georg Ohm",
    //     "description": "lkdjhbvnwndbmsncldjfbcj",
    //     "nationality": "Pisa, Italy",
    //     "year_born": 1789, 
    //     "year_died": 1854,
    //     "discovery": [
    //         "Was the first person to study the sky with a telescope",
    //         "Discovered the first moons ever known to orbit a planet other than Earth", 
    //         "Jupiter’s four largest moons, which he discovered: Io, Europa, Ganymede, and Callisto, are together known as the Galilean Satellites in his honor",
    //         "Discovered that Venus has phases like the moon, ranging from a thin crescent to full. This was the first practical, observational evidence that the sun sits at the center of the solar system",
    //         "Discovered the rings of Saturn",
    //         "Discovered our moon has mountains",
    //         "Discovered that the Milky Way is made up of stars",
    //         "Was the first person ever to see the planet Neptune",
    //         "Established that, if there is no air resistance, everything falls to the ground at the same rate regardless of its weight",
    //         " Established that when gravity accelerates any object, the object accelerates at a constant rate"
    //     ]
    // },

    // Guglielmo Marconi
    // {
    //     "id": 39,
    //     "name": "Guglielmo Marconi",
    //     "description": "lkdjhbvnwndbmsncldjfbcj",
    //     "nationality": "Pisa, Italy",
    //     "year_born": 1874, 
    //     "year_died": 1937,
    //     "discovery": [
    //         "Was the first person to study the sky with a telescope",
    //         "Discovered the first moons ever known to orbit a planet other than Earth", 
    //         "Jupiter’s four largest moons, which he discovered: Io, Europa, Ganymede, and Callisto, are together known as the Galilean Satellites in his honor",
    //         "Discovered that Venus has phases like the moon, ranging from a thin crescent to full. This was the first practical, observational evidence that the sun sits at the center of the solar system",
    //         "Discovered the rings of Saturn",
    //         "Discovered our moon has mountains",
    //         "Discovered that the Milky Way is made up of stars",
    //         "Was the first person ever to see the planet Neptune",
    //         "Established that, if there is no air resistance, everything falls to the ground at the same rate regardless of its weight",
    //         " Established that when gravity accelerates any object, the object accelerates at a constant rate"
    //     ]
    // },

        // Hans Bethe
        // {
        //     "id": 40,
        //     "name": "Hans Bethe",
        //     "description": "lkdjhbvnwndbmsncldjfbcj",
        //     "nationality": "Pisa, Italy",
        //     "year_born": 1906, 
        //     "year_died": 2005,
        //     "discovery": [
        //         "Was the first person to study the sky with a telescope",
        //         "Discovered the first moons ever known to orbit a planet other than Earth", 
        //         "Jupiter’s four largest moons, which he discovered: Io, Europa, Ganymede, and Callisto, are together known as the Galilean Satellites in his honor",
        //         "Discovered that Venus has phases like the moon, ranging from a thin crescent to full. This was the first practical, observational evidence that the sun sits at the center of the solar system",
        //         "Discovered the rings of Saturn",
        //         "Discovered our moon has mountains",
        //         "Discovered that the Milky Way is made up of stars",
        //         "Was the first person ever to see the planet Neptune",
        //         "Established that, if there is no air resistance, everything falls to the ground at the same rate regardless of its weight",
        //         " Established that when gravity accelerates any object, the object accelerates at a constant rate"
        //     ]
        // },

        // Hans Christian Oersted
        // {
        //     "id": 41,
        //     "name": "Hans Christian Oersted",
        //     "description": "lkdjhbvnwndbmsncldjfbcj",
        //     "nationality": "Pisa, Italy",
        //     "year_born": 1777, 
        //     "year_died": 1851,
        //     "discovery": [
        //         "Was the first person to study the sky with a telescope",
        //         "Discovered the first moons ever known to orbit a planet other than Earth", 
        //         "Jupiter’s four largest moons, which he discovered: Io, Europa, Ganymede, and Callisto, are together known as the Galilean Satellites in his honor",
        //         "Discovered that Venus has phases like the moon, ranging from a thin crescent to full. This was the first practical, observational evidence that the sun sits at the center of the solar system",
        //         "Discovered the rings of Saturn",
        //         "Discovered our moon has mountains",
        //         "Discovered that the Milky Way is made up of stars",
        //         "Was the first person ever to see the planet Neptune",
        //         "Established that, if there is no air resistance, everything falls to the ground at the same rate regardless of its weight",
        //         " Established that when gravity accelerates any object, the object accelerates at a constant rate"
        //     ]
        // },

        // Heinrich Hertz
        // {
        //     "id": 42,
        //     "name": "Heinrich Hertz",
        //     "description": "lkdjhbvnwndbmsncldjfbcj",
        //     "nationality": "German port city of Hamburg",
        //     "year_born": 1857, 
        //     "year_died": 1894,
        //     "discovery": [
        //         "He discovered Radio Waves and the Photoelectric Effect"
        //     ]
        // },

        // Henry Moseley
        // {
        //     "id": 43,
        //     "name": "Henry Moseley",
        //     "description": "lkdjhbvnwndbmsncldjfbcj",
        //     "nationality": "Weymouth, England, UK",
        //     "year_born": 1887, 
        //     "year_died": 1915,
        //     "discovery": [
        //         "The True Basis of the Periodic Table",
        //         "The Atomic Battery",
        //         "Four New Chemical Elements",
        //         "New Method of Identifying Elements"
        //     ]
        // },

        // Inge Lehmann
        // {
        //     "id": 44,
        //     "name": "Inge Lehmann",
        //     "description": "lkdjhbvnwndbmsncldjfbcj",
        //     "nationality": "Denmark’s capital city, Copenhagen",
        //     "year_born": 1888, 
        //     "year_died": 1993,
        //     "discovery": [
        //         "Earth Research"
        //     ]
        // },

        // Irene Joliot-Curie
        // {
        //     "id": 45,
        //     "name": "Irene Joliot-Curie",
        //     "description": "lkdjhbvnwndbmsncldjfbcj",
        //     "nationality": "France’s capital city, Paris",
        //     "year_born": 1897, 
        //     "year_died": 1956,
        //     "discovery": [
        //         "Almost Discovering the Neutron",
        //         "Making the First Artificial Radioactive Elements"
        //     ]
        // },

        // Irene Joliot-Curie
        // {
        //     "id": 45,
        //     "name": "Irene Joliot-Curie",
        //     "description": "lkdjhbvnwndbmsncldjfbcj",
        //     "nationality": "France’s capital city, Paris",
        //     "year_born": 1897, 
        //     "year_died": 1956,
        //     "discovery": [
        //         "Almost Discovering the Neutron",
        //         "Making the First Artificial Radioactive Elements"
        //     ]
        // },

        // Isaac Newton
        // {
        //     "id": 46,
        //     "name": "Isaac Newton",
        //     "description": "Was an English physicist and mathematician who was the culminating figure of the Scientific Revolution of the 17th century",
        //     "nationality": "Woolsthorpe-by-Colsterworth, Lincolnshire, England",
        //     "awards_and_honors": ["Unavailable"],
        //     "year_born": 1643,
        //     "year_died": 1727,
        //     "discovery": [
        //         "Calculus", 
        //         "Universal Gravitation",
        //         "Newton's laws of motion",
        //         "Optics and Light (Reflection snd refraction)",
        //         "Showed that Kepler’s laws of planetary motion are special cases of Newton’s universal gravitation",
        //         "Proved that all objects moving through space under the influence of gravity must follow a path shaped in the form of one of the conic sections, such as a circle, an ellipse, or a parabola, hence explaining the paths all planets and comets follow",
        //         "Showed that the tides are caused by gravitational interactions between the earth, the moon, and the sun",
        //         "Predicted, correctly, that the earth is not perfectly spherical but is squashed into an oblate spheroid, larger around the equator than around the poles",
        //         "Used mathematics to model the movement of fluids – from which the concept of a Newtonian fluid comes",
        //         "Devised Newton’s Method for finding the roots of mathematical functions."
        //     ] 
        // },

        // J. J. Thompson
        // {
        //     "id": 47,
        //     "name": "J. J. Thomson",
        //     "description": "This is a description for Isaac Newton",
        //     "nationality": "Woolsthorpe-by-Colsterworth, Lincolnshire, England",
        //     "year_born": 1856,
        //     "year_died": 1940,
        //     "discovery": [
        //         "Calculus", 
        //         "Universal Gravitation",
        //         "Newton's laws of motion",
        //         "Optics and Light",
        //         "Showed that Kepler’s laws of planetary motion are special cases of Newton’s universal gravitation",
        //         "Proved that all objects moving through space under the influence of gravity must follow a path shaped in the form of one of the conic sections, such as a circle, an ellipse, or a parabola, hence explaining the paths all planets and comets follow",
        //         "Showed that the tides are caused by gravitational interactions between the earth, the moon, and the sun",
        //         "Predicted, correctly, that the earth is not perfectly spherical but is squashed into an oblate spheroid, larger around the equator than around the poles",
        //         "Used mathematics to model the movement of fluids – from which the concept of a Newtonian fluid comes",
        //         "Devised Newton’s Method for finding the roots of mathematical functions."
        //     ] 
        // },

        // J. Robert Oppenheimer
        // {
        //     "id": 48,
        //     "name": "J. Robert Oppenheimer",
        //     "description": "This is a description for Isaac Newton",
        //     "nationality": "Woolsthorpe-by-Colsterworth, Lincolnshire, England",
        //     "year_born": 1904,
        //     "year_died": 1967,
        //     "discovery": [
        //         "Calculus", 
        //         "Universal Gravitation",
        //         "Newton's laws of motion",
        //         "Optics and Light",
        //         "Showed that Kepler’s laws of planetary motion are special cases of Newton’s universal gravitation",
        //         "Proved that all objects moving through space under the influence of gravity must follow a path shaped in the form of one of the conic sections, such as a circle, an ellipse, or a parabola, hence explaining the paths all planets and comets follow",
        //         "Showed that the tides are caused by gravitational interactions between the earth, the moon, and the sun",
        //         "Predicted, correctly, that the earth is not perfectly spherical but is squashed into an oblate spheroid, larger around the equator than around the poles",
        //         "Used mathematics to model the movement of fluids – from which the concept of a Newtonian fluid comes",
        //         "Devised Newton’s Method for finding the roots of mathematical functions."
        //     ] 
        // },

        // James Chadwick
        // {
        //     "id": 49,
        //     "name": "James Chadwick",
        //     "description": "This is a description for Isaac Newton",
        //     "nationality": "Bollington, England",
        //     "year_born": 1891,
        //     "year_died": 1974,
        //     "discovery": [
        //         "James Chadwick discovered the neutron in 1932 and was awarded the Nobel Prize for Physics in 1935"
        //     ] 
        // },

        // James Clerk Maxwell
        // {
        //     "id": 50,
        //     "name": "James Clerk Maxwell",
        //     "description": "Regarded by modern physicists as the scientist of the 19th century who had the greatest influence on 20th century physics",
        //     "nationality": "Edinburgh, Scotland, UK",
        //     "year_born": 1831,
        //     "year_died": 1879,
        //     "discovery": [
        //         "Color in the Human Eye and Photography",
        //         "Electromagnetism – The First Unification of Nature’s Forces",
        //         "The Kinetic Theory of Gases and Statistical Physics"
        //     ] 
        // },

        // Johannes Kepler
        // {
        //     "id": 51,
        //     "name": "Johannes Kepler",
        //     "description": "This is a description for Isaac Newton",
        //     "nationality": "Weil der Stadt, which then lay in the Holy Roman Empire, and is now in Germany",
        //     "year_born": 1571,
        //     "year_died": 1630,
        //     "discovery": [
        //         "The Tides",
        //         "Optics",
        //         "Kepler’s ‘Last Theorem",
        //         "Logarithms"
        //     ] 
        // },

        // John Bardeen
        // {
        //     "id": 52,
        //     "name": "John Bardeen",
        //     "description": "This is a description for Isaac Newton",
        //     "nationality": "Weil der Stadt, which then lay in the Holy Roman Empire, and is now in Germany",
        //     "year_born": 1908,
        //     "year_died": 1991,
        //     "discovery": [
        //         "The Tides",
        //         "Optics",
        //         "Kepler’s ‘Last Theorem",
        //         "Logarithms"
        //     ] 
        // },

        // John Cockcroft
        // {
        //     "id": 53,
        //     "name": "John Cockcroft",
        //     "description": "This is a description for Isaac Newton",
        //     "nationality": "Todmorden, Yorkshire, England, UK",
        //     "year_born": 1897,
        //     "year_died": 1967,
        //     "discovery": [
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
        //     "year_born": 1724,
        //     "year_died": 1793,
        //     "discovery": [
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
        //     "year_born": 490,
        //     "year_died": 570,
        //     "discovery": [
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
        //     "year_born": 1616,
        //     "year_died": 1703,
        //     "discovery": [
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
        //     "year_born": 1797,
        //     "year_died": 1878,
        //     "discovery": [
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
        //     "year_born": 1736,
        //     "year_died": 1813,
        //     "discovery": [
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
        //     "year_born": 1736,
        //     "year_died": 1813,
        //     "discovery": [
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
        //     "year_born": 1890,
        //     "year_died": 1971,
        //     "discovery": [
        //         "He discovered how to ‘see’ the positions of atoms in solids",
        //         "His discovery has had an enormous impact on chemistry, biology, and mineralogy",
        //         "Bragg showed how X-rays passing through a crystal collect information allowing the crystal’s atomic structure to be deduced"
        //     ] 
        // },

        // Lisa Randall
        // {
        //     "id": 61,
        //     "name": "Lisa Randall",
        //     "description": "This is a description for Isaac Newton",
        //     "nationality": "Adelaide, capital of the British colony of South Australia",
        //     "year_born": 1890,
        //     "year_died": 1971,
        //     "discovery": [
        //         "He discovered how to ‘see’ the positions of atoms in solids",
        //         "His discovery has had an enormous impact on chemistry, biology, and mineralogy",
        //         "Bragg showed how X-rays passing through a crystal collect information allowing the crystal’s atomic structure to be deduced"
        //     ] 
        // },

        // Lise Meitner
        // {
        //     "id": 62,
        //     "name": "Lise Meitner",
        //     "description": "This is a description for Isaac Newton",
        //     "nationality": "Vienna, capital of the Austro-Hungarian Empire",
        //     "year_born": 1878,
        //     "year_died": 1968,
        //     "discovery": [
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
        //     "year_born": 1824,
        //     "year_died": 1907,
        //     "discovery": [
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
        //     "year_born": 1911,
        //     "year_died": 1988,
        //     "discovery": [
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
        //     "year_born": 1867,
        //     "year_died": 1934,
        //     "discovery": [
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
        //     "year_born": 1926,
        //     "year_died": 2020,
        //     "discovery": [
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
        //     "year_born": 1882,
        //     "year_died": 1970,
        //     "discovery": [
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
        //     "year_born": 1858,
        //     "year_died": 1947,
        //     "discovery": [
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
        //     "year_born": 1791,
        //     "year_died": 1867,
        //     "discovery": [ 
        //         "Discovery of Electromagnetic Rotation", 
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
        //     "year_born": 1947,
        //     "year_died": 186766,
        //     "discovery": [ 
        //         "Popularizer of science"
        //     ]
        // },

        // Murray Gell-Mann
        // {
        //     "id": 71,
        //     "name": "Murray Gell-Mann",
        //     "description": "Description for Michael Faraday",
        //     "nationality": "London, England, UK.",
        //     "year_born": 1929,
        //     "year_died": 2019,
        //     "discovery": [ 
        //         "Popularizer of science"
        //     ]
        // },

        // Nicolo Tartaglia
        // {
        //     "id": 72,
        //     "name": "Nicolo Tartaglia",
        //     "description": "Description for Michael Faraday",
        //     "nationality": "London, England, UK.",
        //     "year_born": 1500,
        //     "year_died": 1557,
        //    "discovery": [ 
        //             "Popularizer of science"
        //     ]
        // },

        // Neils Bohr
        // {
        //     "id": 73,
        //     "name": "Neils Bohr",
        //     "description": "Denmark’s capital city, Copenhagen",
        //     "nationality": "Denmark’s capital city, Copenhagen",
        //     "year_born": 1885,
        //     "year_died": 1962,
        //    "discovery": [ 
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
        //     "year_born": 1856,
        //     "year_died": 1943,
        //     "discovery": [ 
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
        //    "year_born": 1902,
        //    "year_died": 1984,
        //    "discovery": [ 
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
        //     "year_born": 1894,
        //     "year_died": 1984,
        //     "discovery": [ 
        //              "Discovery of Superfluidity"
        //      ]
        //  },

        // Richard A. Muller
        // {
        //     "id": 77,
        //     "name": "Richard A. Muller",
        //     "description": "Denmark’s capital city, Copenhagen",
        //     "nationality": "Kronstadt, an island fortress near Saint Petersburg, capital of the Russian Empire",                  
        //     "year_born": 1894,
        //     "year_died": 1984,
        //     "discovery": [ 
        //              "Discovery of Superfluidity"
        //      ]
        //  },

        // Richard Feynman
        // {
        //     "id": 78,
        //     "name": "Richard Feynman",
        //     "description": "Denmark’s capital city, Copenhagen",
        //     "nationality": "Kronstadt, an island fortress near Saint Petersburg, capital of the Russian Empire",                  
        //     "year_born": 1918,
        //     "year_died": 1988,
        //     "discovery": [ 
        //              "Discovery of Superfluidity"
        //      ]
        //  },

        // Robert Hooke
        // {
        //     "id": 79,
        //     "name": "Robert Hooke",
        //     "description": "Denmark’s capital city, Copenhagen",
        //     "nationality": "Isle of Wight, England",                  
        //     "year_born": 1635,
        //     "year_died": 1703,
        //     "discovery": [ 
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
        //     "year_born": 1635,
        //     "year_died": 1703,
        //     "discovery": [ 
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
        //     "year_born": 1635,
        //     "year_died": 1974,
        //     "discovery": [ 
        //              "S. N. Bose founded quantum statistics in 1924 when he discovered a new way to derive Planck’s radiation law"
        //      ]
        //  },

        // Stephen Hawking
        // {
        //     "id": 82,
        //     "name": "Stephen Hawking",
        //     "description": "Denmark’s capital city, Copenhagen",
        //     "nationality": "British India’s capital city, Calcutta, Bengal Presidency. Today the city is known as Kolkata, located in the Indian state of West Bengal",                  
        //     "year_born": 1942,
        //     "year_died": 2018,
        //     "discovery": [ 
        //              "S. N. Bose founded quantum statistics in 1924 when he discovered a new way to derive Planck’s radiation law"
        //      ]
        //  },

        // Steven Weinberg
        // {
        //     "id": 83,
        //     "name": "Steven Weinberg",
        //     "description": "Denmark’s capital city, Copenhagen",
        //     "nationality": "British India’s capital city, Calcutta, Bengal Presidency. Today the city is known as Kolkata, located in the Indian state of West Bengal",                  
        //     "year_born": 1933,
        //     "year_died": 2021,
        //     "discovery": [ 
        //              "S. N. Bose founded quantum statistics in 1924 when he discovered a new way to derive Planck’s radiation law"
        //      ]
        //  },

        // SUBRAHMANYAN CHANDRASEKHAR
        // {
        //     "id": 84,
        //     "name": "SUBRAHMANYAN CHANDRASEKHAR",
        //     "description": "Denmark’s capital city, Copenhagen",
        //     "nationality": "Lahore, British India. (Lahore is now in Pakistan.)",                  
        //     "year_born": 1910,
        //     "year_died": 1995,
        //     "discovery": [ 
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
        //     "year_born": 1773,
        //     "year_died": 1829,
        //     "discovery": [ 
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
        //     "year_born": 1928,
        //     "year_died": 2016,
        //     "discovery": [ 
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
        //     "year_born": 1901,
        //     "year_died": 1976,
        //     "discovery": [ 
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
        //     "year_born": 1839,
        //     "year_died": 1903,
        //     "discovery": [ 
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
        //     "year_born": 1544,
        //     "year_died": 1603,
        //     "discovery": [ 
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
        //     "year_born": 1900,
        //     "year_died": 1958,
        //     "discovery": [ 
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
        //     "year_born": 1821,
        //     "year_died": 1894,
        //     "discovery": [ 
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
        //     "description": "Was a british chemist and physicist best known for the rediscovery of fixed air (carbon dioxide).",
        //     "nationality": "Bordeaux, France",
        //     "awards_honors": [""],                  
        //     "year_born": 1728,
        //     "year_died": 1799,
        //     "discovery": [ 
        //              "latent heat",
        //              "bicarbonate",
        //              "carbon dioxide"
        //      ]
        //  },

]

physicistSchema.parse(physicistsData);