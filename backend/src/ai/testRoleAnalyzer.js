import { analyzeResumeForRole } from "./roleAnalyzer.js";

const resumeData = {
    personalInfo: {
        name: "Rishiket Pagi",
        email: "pagirishiket@gmail.com",
        phone: "+91 8010025418",
        location: "Loliem, Canacona, Goa",
        linkedin: "https://www.linkedin.com/in/rishiket-pagi",
        github: "https://github.com/rishiketpagi",
        portfolio: ""
    },

    professionalSummary: "",

    education: [
        {
            institution: "Goa College of Engineering",
            degree: "Bachelor of Engineering",
            field: "Computer Engineering",
            startDate: "2023",
            endDate: "Present",
            grade: "CGPA: 7.27"
        }
    ],

    workExperience: [],

    projects: [
        {
            name: "Mentify – Digital Mentorship Management System",
            description:
                "Developed a mobile-first mentorship management app using React Native. Implemented authentication and Firebase real-time data storage. Built role-based dashboards.",
            technologies: [
                "React Native",
                "Firebase",
                "Clerk",
                "JavaScript",
                "NativeWind"
            ],
            url: "https://github.com/5HAUNzee/Mentify",
            startDate: "",
            endDate: ""
        },
        {
            name: "FlowerBloom – Online Flower Shopping Website",
            description:
                "Built a responsive flower shopping interface using React and Tailwind CSS. Developed reusable components.",
            technologies: [
                "React.js",
                "Tailwind CSS",
                "JavaScript"
            ],
            url: "https://github.com/rishiketpagi/FlowerBoom",
            startDate: "",
            endDate: ""
        }
    ],

    skills: [
        "Python",
        "C",
        "C++",
        "JavaScript",
        "HTML",
        "CSS",
        "Tailwind CSS",
        "React.js",
        "PHP",
        "Node.js",
        "React Native",
        "MySQL",
        "Firebase",
        "Git",
        "VS Code",
        "Data Structures",
        "Algorithms",
        "Object-Oriented Programming"
    ],

    certifications: [
        {
            name: "Google AI-ML Virtual Internship",
            issuer: "Google (AICTE EduSkills)",
            date: "",
            url: ""
        }
    ],

    achievements: [
        "LeetCode – 100+ coding problems solved"
    ]
};

const result = await analyzeResumeForRole(
    resumeData,
    "Backend Developer"
);

console.log(
    JSON.stringify(result, null, 2)
);