document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = String(new Date().getFullYear());
  }

  // Mobile nav
  const navToggle = document.querySelector("[data-nav-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");

  function setMobileNavOpen(isOpen) {
    if (!navToggle || !mobileNav) return;
    navToggle.setAttribute("aria-expanded", String(isOpen));
    mobileNav.hidden = !isOpen;
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      setMobileNavOpen(!isOpen);
    });

    mobileNav.addEventListener("click", (event) => {
      if (event.target === mobileNav) setMobileNavOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMobileNavOpen(false);
    });

    mobileNav.querySelectorAll("a[href^='#']").forEach((link) => {
      link.addEventListener("click", () => setMobileNavOpen(false));
    });
  }

  // Language switcher (FR / EN)
  const translations = {
    fr: {
      brandName: "Yu‑Ting Tseng",
      nav: {
        about: "À propos",
        skills: "Compétences",
        education: "Formation",
        experience: "Expériences",
        portfolio: "Portfolio",
        extracurricular: "Expériences extra‑scolaires",
        volunteer: "Bénévolat",
        honors: "Distinctions",
        projects: "Projets",
        contact: "Contact",
        teaching: {
          languages: "Langues",
          engagement: "Engagement",
        },
      },
      hero: {
        kicker: "Marketing digital · Analyse de données",
        title1: "Je transforme les données en",
        title2: "décisions marketing",
        summary:
          "Étudiante en Master à emlyon business school, je combine une solide expertise analytique et une forte sensibilité pour le marketing stratégique et l’expérience client. Je souhaite mettre mes compétences au service de marques ambitieuses en digital, performance et développement de l’activité.",
        locationLabel: "Basée à",
        locationValue: "Lyon, France",
        availabilityLabel: "Disponible à partir de",
        availabilityValue: "juillet 2026 / janvier 2027 (stage de césure de 6 mois)",
        ctaPrimary: "Me contacter",
        ctaSecondary: "Voir mes expériences",
        cardName: "Yu‑Ting Tseng",
        cardRole: "Marketing digital & Data",
        cardEmailLabel: "Email",
        cardPhoneLabel: "Téléphone",
        cardLanguagesLabel: "Langues",
      },
      skills: {
        title: "Compétences",
        subtitle:
          "Un socle structuré autour de l’analyse de données, du marketing digital et d’un profil international.",
        filterAll: "Tout",
        previewTitle: "Détail d’une compétence",
        previewText: "Survolez une compétence pour voir des preuves (projets, cours, expériences) avec le contexte, ce qui a été fait et les résultats.",
      },
      education: {
        title: "Formation académique",
        subtitle:
          "Un parcours international entre la France et Taïwan, à l’interface du management, de la finance et des langues.",
        emlyon: {
          period: "09/2023 – Aujourd’hui",
          title: "Master in Management (Programme Grande École)",
          school: "emlyon business school",
          point1: "Spécialisation en marketing, data et stratégie.",
          point2: "Projets de groupe avec des entreprises partenaires.",
          gpa: "GPA : en cours.",
        },
        nccu: {
          period: "09/2020 – 06/2025",
          title: "Bachelor en français & diplomatie",
          school: "Université Nationale Chengchi (NCCU)",
          majorLabel: "Majeure",
          minorLabel: "Mineure",
          major1: "Langues européennes (français)",
          major2: "Diplomatie",
          minor1: "Économie",
          minor2: "Droit",
          point2: "Travaux de recherche sur les enjeux économiques et géopolitiques.",
          gpa: "GPA : 4,22 / 4,3 (3,99 / 4,0).",
        },
        paris1: {
          period: "01/2024 – 06/2024",
          title: "Programme d’échange en science politique",
          school: "Université Paris 1 Panthéon‑Sorbonne",
          point1: "Approfondissement des politiques européennes et internationales.",
          point2: "Immersion académique et culturelle en France.",
          course1: "Science politique",
          course2: "Relations internationales",
          course3: "Politiques européennes",
        },
        coursesLabel: "Cours pertinents",
      },
      pageSwitcher: {
        business: "Business",
        teaching: "Enseignement",
      },
      teachingHero: {
        kicker: "Langues & engagement international",
        title1: "Immersion linguistique &",
        title2: "échange interculturel",
        summary: "Locutrice native en mandarin, certifiée DALF C1 (français), IELTS 8.0 (anglais) et JLPT N1 (japonais). Engagée dans des programmes d’accompagnement linguistique et d’échange culturel à Taïwan.",
        ctaSecondary: "Voir mes engagements",
      },
      teachingLanguages: {
        title: "Compétences linguistiques",
        subtitle: "Certifications officielles et pratique quotidienne dans quatre langues.",
      },
      teachingEngagement: {
        title: "Engagement linguistique & international",
        subtitle: "Programmes de mentorat linguistique, immersion culturelle et échanges internationaux.",
      },
            experience: {
        title: "Expériences professionnelles",
        subtitle:
          "Une sélection de mes expériences en marketing digital, analyse de données et gestion de projet.",
        kpn: {
          period: "01/2025 – 06/2025",
          title: "Assistante Marketing Digital",
          point1: "Optimisation SEO (on-page / technique) et recommandations de contenus.",
          point2: "Suivi de KPIs et analyse de performance (trafic, CTR, conversions).",
          point3: "Campagnes SEA et reporting.",
        },
        engoo: {
          period: "10/2024 – 02/2025",
          title: "Assistante Marketing",
          point1: "Stratégie de contenu Xiaohongshu basée sur le modèle STP et A/B testing – +89.1% d’interactions et +69.7% d’abonnés en 3 mois.",
          point2: "Veille concurrentielle, analyse d’audience et adaptation des visuels par sous-segment cible.",
          point3: "Création de contenus Meta (Facebook & Instagram) alignés avec les tendances et la marque.",
        },
        teaching: {
          period: "07/2023 – 12/2023 · 07/2024 – 04/2025",
          title: "Assistante d’enseignement",
          point1: "Support de cours (finance, risk management) et suivi des étudiants.",
          point2: "Préparation de supports et coordination logistique.",
        },
        research: {
          period: "06/2023 – 12/2023",
          title: "Assistante de recherche",
          point1: "Collecte, nettoyage et analyse de données pour des travaux de recherche.",
          point2: "Préparation de synthèses et supports pour séminaires.",
        },
        filterAll: "Toutes",
        filterTeaching: "Teaching",
        filterFinance: "Finance",
        filterMarketing: "Marketing",
        viewAll: "Voir tout",
      },
      portfolio: {
        title: "Portfolio – Social Media & Design",
        subtitle: "Exemples concrets de contenus créés, de campagnes gérées et de travaux visuels.",
        viewPdf: "Voir le portfolio complet (PDF)",
        engoo: {
          tag: "Social Media",
          title: "Engoo – Campagne Xiaohongshu",
          desc: "Reprise et développement du compte Xiaohongshu d’Engoo sur le marché chinois simplifié. Stratégie de contenu fondée sur le modèle STP, A/B testing des visuels et des textes, ciblage de sous-segments selon leur profil.",
          stat1: "Vues",
          stat2: "Abonnés",
          stat3: "Interactions",
        },
        guzheng: {
          tag: "Community Management",
          title: "政大古箏社 – Page Facebook",
          desc: "Gestion de la page Facebook du club de guzheng de NCCU. Création de visuels pour les annonces d’activités, recrutement de nouveaux membres et couverture d’événements de fin d’année.",
        },
        instagram: {
          tag: "Content Creation",
          title: "Compte lectures personnelles",
          desc: "Création de contenus visuels et rédactionnels pour un compte Instagram dédié aux comptes rendus de lecture. Narration visuelle originale et analyse littéraire accessible – ex. Des fleurs pour Algernon.",
        },
        design: {
          tag: "Photographie & Design",
          title: "Photographie & supports promotionnels",
          desc: "Photographie de paysages, portraits et architecture – recherche d’angles et d’éléments inattendus. Création de supports de communication pour événements : badges, affiches, publications pour le club de kyudo et d’autres activités.",
        },
      },
      projects: {
        title: "Projets sélectionnés",
        subtitle:
          "Quelques projets académiques ou personnels illustrant ma manière de travailler et mes centres d’intérêt.",
      },
      extracurricular: {
        title: "Expériences extra‑scolaires",
        subtitle:
          "Engagements dans des clubs et associations qui complètent mon parcours académique.",
        guzheng: {
          title:
            "Directrice marketing & adhésions – Club de guzheng (cithare chinoise)",
          text:
            "Organisation des campagnes de recrutement, gestion des réseaux sociaux, adaptation des cours en fonction des retours et coordination des événements et performances.",
        },
        camps: {
          title: "Co‑fondatrice – Sora Education (camps de jeunesse)",
          text:
            "Organisation de cinq camps d’été d’une semaine avec deux partenaires, élaboration du business plan, suivi financier et études de marché pour ajuster l’offre de cours et la stratégie marketing.",
        },
        clubs: {
          title: "Autres clubs étudiants",
          text:
            "Participation à International College Exchange, Toastmasters, Kyudo, Kendo et Ikebana (art floral).",
        },
        filterAll: "Toutes",
        periodTBD: "Période à préciser",
        filterEntrepreneurship: "Entrepreneuriat",
        filterClubs: "Clubs & culture",
        viewAll: "Voir tout",
      },
      volunteer: {
        title: "Expériences de bénévolat & engagement",
        subtitle:
          "Des initiatives centrées sur l’éducation, l’international et l’impact social.",
        aiesec: {
          period: "09/2024 – Présent",
          title: "Membre – AIESEC in NCCU",
          org:
            "AIESEC · Organisation internationale de développement du leadership",
          point1:
            "Pilotage d’une équipe marketing de 4 personnes pour recruter 15 volontaires et plus de 60 participants à un camp d’anglais, au‑delà de l’objectif budgétaire.",
          point2:
            "Collaboration avec des partenaires locaux et internationaux sur des programmes de volontariat.",
        },
        usr: {
          period: "09/2024 – Présent",
          title: "Volontaire – Projet University Social Responsibility",
          org: "NCCU · Office of University Responsibility",
          point1:
            "Accompagnement d’élèves issus de familles transnationales dans l’apprentissage de la langue et l’intégration culturelle.",
        },
        flagship: {
          period: "09/2023 – Présent",
          title: "Volontaire – Programme de compagnonnage linguistique",
          org: "Chinese Overseas Flagship Center in Taiwan",
          point1:
            "Facilitation de l’immersion linguistique et culturelle d’étudiants américains via des événements et visites.",
        },
        buddy: {
          period: "09/2023 – 01/2025",
          title: "Étudiante‑référente – Buddy Program",
          org: "NCCU · Office of International Cooperation",
          point1:
            "Accompagnement de trois étudiants en échange (France, États‑Unis, Corée du Sud) dans leur vie quotidienne à Taïwan.",
        },
        nuit: {
          period: "12/2023",
          title: "Déléguée – Nuit des Idées (français‑mandarin)",
          org:
            "Bureau français de Taipei, Institut Français & Département de la Culture de Taipei",
          point1:
            "Présentation de points de vue sur des sujets de durabilité devant plus de 350 participants, en français et en chinois.",
        },
      },
      honors: {
        title: "Distinctions & bourses",
        subtitle:
          "Reconnaissance académique pour mes résultats et mon engagement.",
        exchange: {
          title: "Bourse d’échange – Ministère de l’Éducation (Taïwan)",
          text:
            "Bourse au mérite pour un programme d’échange international en France.",
          year: "2024",
        },
        short: {
          title: "Bourse d’études à court terme – NCCU",
          text:
            "Financement au mérite pour un séjour d’études à l’étranger.",
          year: "2024",
        },
        excellence: {
          title: "Certificate of Excellence – Top 5% GPA",
          text:
            "Récompense académique pour des résultats parmi les 5 % meilleurs étudiants de NCCU.",
          year: "2021, 2023",
        },
      },
      contact: {
        heading: "Entrons en contact",
        intro:
          "Intéressé·e par un stage, un projet ou une collaboration ? Envoyez‑moi un message, je vous répondrai avec plaisir.",
        labelEmail: "Email",
        labelPhone: "Téléphone",
        labelLocation: "Localisation",
        formName: "Nom",
        formEmail: "Email",
        formMessage: "Message",
        namePlaceholder: "Votre nom",
        emailPlaceholder: "vous@exemple.com",
        messagePlaceholder: "Expliquez brièvement votre besoin ou votre projet.",
        submit: "Envoyer le message",
        formNote:
          "Ce formulaire est une démonstration front‑end. Connectez‑le à Formspree ou Netlify Forms pour l'activer.",
      },
    },
    en: {
      brandName: "Yu‑Ting Tseng",
      nav: {
        about: "About",
        skills: "Skills",
        education: "Education",
        experience: "Experience",
        portfolio: "Portfolio",
        extracurricular: "Activities",
        volunteer: "Volunteering",
        honors: "Honors",
        projects: "Projects",
        contact: "Contact",
        teaching: {
          languages: "Languages",
          engagement: "Engagement",
        },
      },
      hero: {
        kicker: "Digital marketing · Data analytics",
        title1: "I turn data into",
        title2: "marketing decisions",
        summary:
          "Master’s student at emlyon business school with strong analytical skills and a passion for digital marketing and customer experience. I aim to support ambitious brands in performance marketing and business development.",
        locationLabel: "Based in",
        locationValue: "Lyon, France",
        availabilityLabel: "Available from",
        availabilityValue: "July 2026 / January 2027 (6-month gap internship)",
        ctaPrimary: "Contact me",
        ctaSecondary: "View my experience",
        cardName: "Yu‑Ting Tseng",
        cardRole: "Digital Marketing & Data",
        cardEmailLabel: "Email",
        cardPhoneLabel: "Phone",
        cardLanguagesLabel: "Languages",
      },
      skills: {
        title: "Skills",
        subtitle:
          "A structured skill set combining data analysis, digital marketing and an international profile.",
        filterAll: "All",
        previewTitle: "Skill detail",
        previewText: "Hover over a skill to see evidence (projects, courses, experience) with context, what was done and the outcomes.",
      },
      education: {
        title: "Academic background",
        subtitle:
          "An international path between France and Taiwan, at the crossroads of management, finance and languages.",
        emlyon: {
          period: "09/2023 – Present",
          title: "Master in Management (Grande École Programme)",
          school: "emlyon business school",
          point1: "Specialisation in marketing, data and strategy.",
          point2: "Group projects with partner companies.",
          gpa: "GPA: ongoing.",
        },
        nccu: {
          period: "09/2020 – 06/2025",
          title: "Bachelor in French & Diplomacy",
          school: "National Chengchi University (NCCU)",
          majorLabel: "Major",
          minorLabel: "Minor",
          major1: "European Languages (French)",
          major2: "Diplomacy",
          minor1: "Economics",
          minor2: "Law",
          point2: "Research work on economic and geopolitical issues.",
          gpa: "GPA: 4.22/4.3 (3.99/4.0).",
        },
        paris1: {
          period: "01/2024 – 06/2024",
          title: "Exchange programme in Political Science",
          school: "Université Paris 1 Panthéon‑Sorbonne",
          point1: "Deepened knowledge of European and international policies.",
          point2: "Academic and cultural immersion in France.",
          course1: "Political Science",
          course2: "International Relations",
          course3: "European Politics",
        },
        coursesLabel: "Relevant courses",
      },
      pageSwitcher: {
        business: "Business",
        teaching: "Teaching",
      },
      teachingHero: {
        kicker: "Languages & international engagement",
        title1: "Language immersion &",
        title2: "intercultural exchange",
        summary: "Native Mandarin speaker, certified DALF C1 (French), IELTS 8.0 (English) and JLPT N1 (Japanese). Engaged in language mentoring and cultural exchange programmes in Taiwan.",
        ctaSecondary: "See my engagement",
      },
      teachingLanguages: {
        title: "Language skills",
        subtitle: "Official certifications and daily use in four languages.",
      },
      teachingEngagement: {
        title: "Language & international engagement",
        subtitle: "Language mentoring, cultural immersion and international exchange programmes.",
      },
            experience: {
        title: "Professional experience",
        subtitle:
          "A selection of my experience in digital marketing, data analysis and project coordination.",
        kpn: {
          period: "01/2025 – 06/2025",
          title: "Digital Marketing Assistant",
          point1: "SEO optimisation (on-page & technical) and content recommendations.",
          point2: "KPI tracking and performance analysis (traffic, CTR, conversions).",
          point3: "SEA campaign management and reporting.",
        },
        engoo: {
          period: "10/2024 – 02/2025",
          title: "Marketing Assistant",
          point1: "Xiaohongshu content strategy using STP model and A/B testing – +89.1% interactions and +69.7% followers in 3 months.",
          point2: "Competitive monitoring, audience analysis and visual adaptation by target sub-segment.",
          point3: "Created Meta content (Facebook & Instagram) aligned with trends and brand identity.",
        },
        teaching: {
          period: "07/2023 – 12/2023 · 07/2024 – 04/2025",
          title: "Teaching Assistant",
          point1: "Course support (finance, risk management) and student follow-up.",
          point2: "Prepared course materials and handled logistics.",
        },
        research: {
          period: "06/2023 – 12/2023",
          title: "Research Assistant",
          point1: "Data collection, cleaning and analysis for research papers.",
          point2: "Produced summaries and seminar materials.",
        },
        filterAll: "All",
        filterTeaching: "Teaching",
        filterFinance: "Finance",
        filterMarketing: "Marketing",
        viewAll: "View all",
      },
      portfolio: {
        title: "Portfolio – Social Media & Design",
        subtitle: "Concrete examples of content created, campaigns managed and visual work produced.",
        viewPdf: "View full portfolio (PDF)",
        engoo: {
          tag: "Social Media",
          title: "Engoo – Xiaohongshu Campaign",
          desc: "Took over and grew Engoo's Xiaohongshu account for the Simplified Chinese market. Content strategy based on the STP model, A/B testing of visuals and copy, sub-segment targeting.",
          stat1: "Views",
          stat2: "Followers",
          stat3: "Interactions",
        },
        guzheng: {
          tag: "Community Management",
          title: "NCCU Guzheng Club – Facebook Page",
          desc: "Managed the Facebook page of NCCU's guzheng (Chinese zither) club. Created visuals for activity announcements, membership recruitment and year-end event coverage.",
        },
        instagram: {
          tag: "Content Creation",
          title: "Personal book review account",
          desc: "Created visual and written content for a personal Instagram account dedicated to book reviews. Original visual storytelling and accessible literary analysis – e.g. Flowers for Algernon.",
        },
        design: {
          tag: "Photography & Design",
          title: "Photography & promotional materials",
          desc: "Photography of landscapes, portraits and architecture – exploring unexpected angles. Designed communication materials for events: name badges, posters and posts for the kyudo club and other activities.",
        },
      },
      projects: {
        title: "Selected projects",
        subtitle:
          "A few academic and personal projects that reflect how I work and what I care about.",
      },
      extracurricular: {
        title: "Extracurricular activities",
        subtitle:
          "Clubs and initiatives that complement my academic path.",
        guzheng: {
          title:
            "Marketing & Membership Director – Guzheng (Chinese zither) Club",
          text:
            "Led recruitment campaigns, managed social media, adjusted course structure based on feedback and coordinated events and performances.",
        },
        camps: {
          title: "Co‑founder – Sora Education (youth camps)",
          text:
            "Co‑ran five week‑long summer camps with two partners, built the business plan, managed finances and conducted market research to refine course design and marketing strategy.",
        },
        clubs: {
          title: "Other student clubs",
          text:
            "Member of International College Exchange, Toastmasters, Kyudo, Kendo and Flower Arrangement club.",
        },
        filterAll: "All",
        periodTBD: "Dates TBC",
        filterEntrepreneurship: "Entrepreneurship",
        filterClubs: "Clubs & culture",
        viewAll: "View all",
      },
      volunteer: {
        title: "Volunteer & leadership experience",
        subtitle:
          "Initiatives focused on education, international exchange and social impact.",
        aiesec: {
          period: "Sep. 2024 – Present",
          title: "Member – AIESEC in NCCU",
          org:
            "AIESEC · Global non‑profit organization developing youth leadership",
          point1:
            "Led a marketing team of four to recruit 15 volunteers and over 60 participants for an English camp, exceeding the balanced‑budget target by 53.7%.",
          point2:
            "Collaborated with local and international partners on global volunteer programmes.",
        },
        usr: {
          period: "Sep. 2024 – Present",
          title: "Volunteer – University Social Responsibility Project",
          org: "NCCU · Office of University Responsibility",
          point1:
            "Tutored transnational students in both language learning and cultural integration.",
        },
        flagship: {
          period: "Sep. 2023 – Present",
          title: "Language Companion – Chinese Overseas Flagship Center",
          org: "Chinese Overseas Flagship Center in Taiwan",
          point1:
            "Supported American students’ language and cultural immersion through events and tours.",
        },
        buddy: {
          period: "Sep. 2023 – Jan. 2025",
          title: "Student Buddy – Buddy Programme",
          org: "NCCU · Office of International Cooperation",
          point1:
            "Helped three exchange students from France, the US and South Korea adapt to life in Taiwan.",
        },
        nuit: {
          period: "Dec. 2023",
          title: "Delegate – Nuit des Idées (French‑Mandarin debates)",
          org:
            "French Office in Taipei, Institut Français & Taipei Department of Cultural Affairs",
          point1:
            "Presented views on sustainability topics in front of an audience of more than 350 people.",
        },
      },
      honors: {
        title: "Honors & awards",
        subtitle: "Academic recognition for performance and engagement.",
        exchange: {
          title:
            "Exchange Student Scholarship (Merit‑based) – Ministry of Education, Taiwan",
          text:
            "Merit scholarship for international exchange studies in France.",
          year: "2024",
        },
        short: {
          title:
            "Short‑term Study Abroad Scholarship (Merit‑based) – NCCU",
          text:
            "Funding for short‑term study abroad based on academic excellence.",
          year: "2024",
        },
        excellence: {
          title: "Certificate of Excellence (Top 5% GPA) – NCCU",
          text:
            "Awarded for maintaining a GPA within the top 5% of the cohort.",
          year: "2021, 2023",
        },
      },
      contact: {
        heading: "Let's connect",
        intro:
          "Interested in an internship, a project or a collaboration? Send me a message and I'll be happy to reply.",
        labelEmail: "Email",
        labelPhone: "Phone",
        labelLocation: "Location",
        formName: "Name",
        formEmail: "Email",
        formMessage: "Message",
        namePlaceholder: "Your name",
        emailPlaceholder: "you@example.com",
        messagePlaceholder: "Briefly describe your project or request.",
        submit: "Send message",
        formNote:
          "This is a front-end demo form. Connect it to Formspree or Netlify Forms to activate it.",
      },
    },
    zh: {
      brandName: "曾郁庭 Yu‑Ting Tseng",
      nav: {
        about: "關於我",
        skills: "技能專長",
        education: "學歷背景",
        experience: "實習與工作",
        portfolio: "作品集",
        extracurricular: "課外活動",
        volunteer: "志工與領導",
        honors: "獎學金與榮譽",
        projects: "專案作品",
        contact: "聯絡方式",
        teaching: {
          languages: "語言能力",
          engagement: "國際參與",
        },
      },
      hero: {
        kicker: "數位行銷 · 數據分析",
        title1: "我將數據轉化為",
        title2: "行銷決策",
        summary:
          "目前就讀 emlyon 商學院管理學碩士，結合嚴謹的資料分析能力與對數位行銷與品牌體驗的熱情，期望協助品牌發展數位行銷與業務成長。",
        locationLabel: "現居",
        locationValue: "法國里昂",
        availabilityLabel: "可開始時間",
        availabilityValue: "2026 年 7 月／2027 年 1 月（6 個月休學實習）",
        ctaPrimary: "聯絡我",
        ctaSecondary: "查看我的經歷",
        cardName: "曾郁庭 Yu‑Ting Tseng",
        cardRole: "數位行銷與資料分析",
        cardEmailLabel: "電子郵件",
        cardPhoneLabel: "電話",
        cardLanguagesLabel: "語言能力",
      },
      skills: {
        title: "技能專長",
        subtitle: "結合理性分析、行銷洞察與跨文化視野的能力架構。",
        filterAll: "全部",
        previewTitle: "技能詳情",
        previewText: "將滑鼠移至技能標籤，查看相關佐證（專案、課程、經歷）及成果說明。",
      },
      education: {
        title: "學歷背景",
        subtitle: "在法國與台灣之間，結合管理、金融與語言的國際化養成。",
        emlyon: {
          period: "2023/09 – 至今",
          title: "管理學碩士（Grande École 計畫）",
          school: "emlyon business school",
          point1: "主修行銷、數據與策略。",
          point2: "與合作企業進行小組專案。",
          gpa: "GPA：進行中。",
        },
        nccu: {
          period: "2020/09 – 2025/06（預計）",
          title: "歐洲語文學系法文組、外交學系雙主修；經濟、法律輔系",
          school: "國立政治大學（NCCU）",
          majorLabel: "主修",
          minorLabel: "輔系",
          major1: "歐洲語文（法文）",
          major2: "外交學",
          minor1: "經濟",
          minor2: "法律",
          point2: "從事經濟與地緣政治議題的學術研究。",
          gpa: "GPA：4.22/4.3（3.99/4.0）。",
        },
        paris1: {
          period: "2024/01 – 2024/06",
          title: "政治學交換學生",
          school: "巴黎第一大學龐岱榮商學院（Paris 1 Panthéon‑Sorbonne）",
          point1: "深化對歐洲及國際政治的理解。",
          point2: "在法國進行學術與文化沉浸。",
          course1: "政治學",
          course2: "國際關係",
          course3: "歐洲政策",
        },
        coursesLabel: "相關課程",
      },
      pageSwitcher: {
        business: "商務",
        teaching: "教學",
      },
      teachingHero: {
        kicker: "語言 · 教學 · 國際交流",
        title1: "跨語言連結，",
        title2: "促進文化交流",
        summary: "中文母語使用者，持有 DALF C1（法語）、IELTS 8.0（英語）、JLPT N1（日語）認證。深度參與語言夥伴計畫與跨文化交流活動。",
        ctaSecondary: "查看我的參與紀錄",
      },
      teachingLanguages: {
        title: "語言能力",
        subtitle: "四語認證與日常應用。",
      },
      teachingEngagement: {
        title: "語言教學與國際參與",
        subtitle: "語言輔導、文化沉浸與國際交流計畫。",
      },
            experience: {
        title: "實習與工作經驗",
        subtitle: "涵蓋數位行銷、數據分析與研究助理等多元角色。",
        kpn: {
          period: "2025/01 – 2025/06",
          title: "數位行銷實習生",
          point1: "網站 SEO 優化（頁面與技術面）及內容建議。",
          point2: "追蹤 KPI 並分析成效（流量、CTR、轉換率）。",
          point3: "執行 SEA 廣告投放與成效報告。",
        },
        engoo: {
          period: "2024/10 – 2025/02",
          title: "行銷實習生",
          point1: "以 STP 模型規劃小紅書內容策略，搭配 A/B 測試優化文案與設計，3 個月內互動量提升 89.1%、粉絲數增加 69.7%。",
          point2: "競品監測、受眾分析，針對不同子客群調整視覺素材。",
          point3: "製作 Meta 平台（Facebook & Instagram）內容，融合品牌調性與趨勢熱點。",
        },
        teaching: {
          period: "2023/07 – 2023/12；2024/07 – 2025/04",
          title: "課程助教",
          point1: "協助金融與風險管理課程教學及學生輔導。",
          point2: "製作教材並負責行政協調。",
        },
        research: {
          period: "2023/06 – 2023/12",
          title: "研究助理",
          point1: "蒐集、整理並分析研究所需數據。",
          point2: "撰寫摘要並製作研討會相關資料。",
        },
        filterAll: "全部",
        filterTeaching: "教學",
        filterFinance: "金融",
        filterMarketing: "行銷",
        viewAll: "顯示全部",
      },
      portfolio: {
        title: "作品集 – 社群經營與設計",
        subtitle: "具體呈現我製作的內容、管理的帳號與視覺設計作品。",
        viewPdf: "查看完整作品集（PDF）",
        engoo: {
          tag: "社群媒體",
          title: "Engoo – 小紅書帳號經營",
          desc: "接手並經營 Engoo 簡中市場小紅書專業號，應用 STP 模型重新規劃內容策略，以 A/B 測試迭代優化文案與視覺素材，根據不同子客群設計選題。",
          stat1: "瀏覽量",
          stat2: "粉絲數",
          stat3: "互動量",
        },
        guzheng: {
          tag: "社群管理",
          title: "政大古箏社 – 臉書粉絲專頁",
          desc: "負責政大古箏社臉書粉絲專頁的日常經營，設計活動宣傳、招募新生與期末聚會等活動的視覺素材。",
        },
        instagram: {
          tag: "內容創作",
          title: "個人閱讀心得 Instagram 帳戶",
          desc: "經營 Instagram 個人閱讀心得帳戶，結合精心設計的版面與深度文字分析，呈現原創書評內容。代表作品：《獻給阿爾吉儂的花束》系列。",
        },
        design: {
          tag: "攝影與設計",
          title: "攝影與活動宣傳設計",
          desc: "擅長拍攝自然風景、人物與建築，善於挖掘新穎角度。同時製作活動宣傳素材，包含弓道社名牌、海報與各類社群貼文設計。",
        },
      },
      projects: {
        title: "精選專案",
        subtitle: "幾個能代表我工作方式與興趣的學術與實務專案。",
      },
      extracurricular: {
        title: "課外活動",
        subtitle: "在社團與個人創業中培養的實作與領導能力。",
        guzheng: {
          title: "國樂古箏社 行銷與會員長",
          text:
            "負責招生與迎新活動、經營社群平台，依回饋調整課程安排，並籌辦演出與期末成果發表。",
        },
        camps: {
          title: "Sora Education 青少年營隊 共同創辦人",
          text:
            "與兩位夥伴共同規劃並營運五梯次一週營隊，撰寫商業計畫、管理財務與資產，並進行市場調查優化課程與行銷策略。",
        },
        clubs: {
          title: "其他校園社團參與",
          text:
            "曾參與國際書院交流社、英語演講社（Toastmasters）、弓道社、劍道社與花道社。",
        },
        filterAll: "全部",
        periodTBD: "時間待確認",
        filterEntrepreneurship: "創業",
        filterClubs: "社團與文化",
        viewAll: "顯示全部",
      },
      volunteer: {
        title: "志工與領導經驗",
        subtitle: "專注於教育、多元文化與社會影響力的實踐。",
        aiesec: {
          period: "2024/09 – 至今",
          title: "AIESEC in NCCU 會員",
          org: "AIESEC 青年領袖國際組織",
          point1:
            "帶領四人行銷團隊，為英語夏令營招募 15 位志工與 60 多名學員，收入較收支平衡目標高出 53.7%。",
          point2:
            "與國內外合作夥伴協作，推動海外志工與交流專案。",
        },
        usr: {
          period: "2024/09 – 至今",
          title: "USR 大學社會責任計畫志工",
          org: "政治大學 大學社會責任辦公室",
          point1:
            "協助多元文化家庭子女的語言學習與文化適應。",
        },
        flagship: {
          period: "2023/09 – 至今",
          title: "華語旗艦計畫 語伴志工",
          org: "台灣華語海外旗艦中心",
          point1:
            "透過活動與導覽，協助美國學生加深對台灣社會與文化的理解。",
        },
        buddy: {
          period: "2023/09 – 2025/01",
          title: "國際學生 Buddy 伙伴",
          org: "政治大學 國際合作事務處",
          point1:
            "協助來自法國、美國與南韓的三位交換生適應在台生活與校園環境。",
        },
        nuit: {
          period: "2023/12",
          title: "「思想之夜」中法雙語活動代表",
          org: "法國在台協會、法國文化協會與台北市文化局",
          point1:
            "代表課程「國際關係與法國社會」上台，以中法雙語分享永續發展相關議題，與 350 多位與會者交流。",
        },
      },
      honors: {
        title: "獎學金與榮譽",
        subtitle: "以成績與表現獲得的獎助與肯定。",
        exchange: {
          title: "教育部公費交換獎學金",
          text: "以優異成績獲頒，支持赴法交換學習。",
          year: "2024",
        },
        short: {
          title: "政治大學短期出國進修獎學金",
          text: "因學業表現優良，獲補助短期出國進修經費。",
          year: "2024",
        },
        excellence: {
          title: "政治大學書卷獎（前 5% GPA）",
          text: "多次以班系前 5% 的成績獲頒書卷獎。",
          year: "2021, 2023",
        },
      },
      contact: {
        heading: "聯絡我",
        intro:
          "對實習、專案或合作感興趣？歡迎傳訊給我，我會盡快回覆。",
        labelEmail: "電子郵件",
        labelPhone: "電話",
        labelLocation: "所在地",
        formName: "姓名",
        formEmail: "電子郵件",
        formMessage: "訊息",
        namePlaceholder: "您的姓名",
        emailPlaceholder: "您的信箱",
        messagePlaceholder: "請簡短說明您的需求或專案。",
        submit: "送出訊息",
        formNote:
          "此表單為前端示範，可接入 Formspree 或 Netlify Forms 等服務。",
      },
    },
  };

  function getTranslation(dict, key) {
    const parts = key.split(".");
    let current = dict;
    for (const part of parts) {
      if (current && Object.prototype.hasOwnProperty.call(current, part)) {
        current = current[part];
      } else {
        return null;
      }
    }
    return typeof current === "string" ? current : null;
  }

  function applyTranslations(lang) {
    const dict = translations[lang];
    if (!dict) return;

    const langCodes = { fr: "fr", en: "en", zh: "zh-Hant" };
    document.documentElement.lang = langCodes[lang] || lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      const val = getTranslation(dict, key);
      if (val !== null) el.textContent = val;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (!key) return;
      const val = getTranslation(dict, key);
      if (val !== null) el.setAttribute("placeholder", val);
    });
  }

  const langButtons = document.querySelectorAll(".lang-btn");
  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang") || "fr";
      langButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      applyTranslations(lang);
    });
  });

  // Ensure default language (French) is applied on load
  applyTranslations("fr");

  // Skill preview on hover
  const skillData = {
    "data-core": {
      title: "Python · R · SQL",
      text:
        "Analyse de données marketing et socio‑économiques avec Python, R et SQL, pour passer des tableaux de bord à des recommandations concrètes.",
      proofs: [
        {
          type: "Expérience",
          title: "Assistante de recherche",
          org: "Institut des Relations Internationales (NCCU)",
          meta: ["Taipei · Taïwan", "06/2023 – 12/2023"],
          points: [
            "Collecte, nettoyage et analyse de données pour des travaux de recherche.",
            "Synthèses et supports pour séminaires.",
          ],
          actions: [{ label: "Voir l’expérience", href: "#exp-research" }],
        },
        {
          type: "Cours",
          title: "Méthodes de recherche (R & statistiques)",
          org: "NCCU",
          meta: ["Cours académique"],
          points: ["Méthodes quantitatives et visualisation pour analyses appliquées."],
          actions: [{ label: "Voir la formation", href: "#edu-nccu" }],
        },
      ],
    },
    "data-bi": {
      title: "Tableau · Power BI",
      text:
        "Construction de tableaux de bord interactifs pour suivre les performances marketing et financières.",
      proofs: [
        {
          type: "Projet",
          title: "Tableau de bord marketing orienté business",
          org: "Projet académique",
          meta: ["Power BI · Excel avancé · Python"],
          points: [
            "Création d’un dashboard pour suivre acquisition, engagement et rétention.",
            "Structuration des KPIs pour aider la prise de décision.",
          ],
        },
      ],
    },
    "data-statistics": {
      title: "Statistiques & méthodes quantitatives",
      text:
        "Méthodes quantitatives (R, statistiques) et qualitatives pour la recherche académique et les études de marché.",
      links: [
        {
          label: "Cours de recherche – NCCU (méthodes qualitatives et quantitatives)",
          href: "#edu-nccu",
        },
      ],
    },
    "data-excel": {
      title: "Modélisation & dashboards Excel",
      text:
        "Modèles Excel avancés, suivi de KPIs et automatisation de reportings.",
      proofs: [
        {
          type: "Expérience",
          title: "Assistante d’enseignement",
          org: "College of Global Banking and Finance (NCCU)",
          meta: ["Taipei · Taïwan", "07/2023 – 12/2023 · 07/2024 – 04/2025"],
          points: ["Préparation de supports, suivi et coordination."],
          actions: [{ label: "Voir l’expérience", href: "#exp-teaching" }],
        },
        {
          type: "Projet",
          title: "Dashboard marketing orienté business",
          org: "Projet académique",
          meta: ["Excel · Power BI"],
          points: ["Modélisation, KPIs et visualisation."],
        },
      ],
    },
    "mkt-seo": {
      title: "SEO on‑page & technique",
      text:
        "Audit SEO, optimisation de contenus et recherche de facteurs de classement Google.",
      proofs: [
        {
          type: "Expérience",
          title: "Assistante Marketing Digital",
          org: "KPN Consulting",
          meta: ["Taipei · Taïwan", "01/2025 – 06/2025"],
          points: [
            "Optimisation SEO (on‑page / technique) et recommandations de contenus.",
            "Suivi de KPIs (trafic, CTR, conversions).",
          ],
          actions: [{ label: "Voir l’expérience", href: "#exp-kpn" }],
        },
        {
          type: "Projet",
          title: "Analyse de performance SEO pour une marque e‑commerce",
          org: "Projet",
          meta: ["GA · Search Console · SEMrush"],
          points: [
            "Audit SEO complet, analyse concurrence, recommandations contenus.",
            "Suivi des indicateurs clés (trafic organique, CTR, conversions).",
          ],
        },
      ],
    },
    "mkt-sea": {
      title: "SEA · Google Ads",
      text:
        "Gestion de campagnes Google Ads orientées performance (CTR, CVR) et optimisation budgétaire.",
      links: [
        {
          label: "Stage KPN – campagnes Google Ads",
          href: "#exp-kpn",
        },
      ],
    },
    "mkt-social": {
      title: "Social media (Xiaohongshu, Meta)",
      text:
        "Création de contenu et optimisation de la visibilité sur Xiaohongshu (RED) et les réseaux sociaux Meta.",
      proofs: [
        {
          type: "Expérience",
          title: "Assistante Marketing",
          org: "Engoo / DMM.com",
          meta: ["Taipei · Taïwan", "10/2024 – 02/2025"],
          points: ["Contenus et optimisation de visibilité sur plateformes social media."],
          actions: [{ label: "Voir l’expérience", href: "#exp-engoo" }],
        },
      ],
    },
    "mkt-research": {
      title: "Études de marché & positionnement",
      text:
        "Analyses de marché pour des marques B2C, avec segmentation, cartographie concurrentielle et recommandations.",
      proofs: [
        {
          type: "Projet",
          title: "Étude de marché – marque lifestyle",
          org: "Projet",
          meta: ["Europe · Asie"],
          points: [
            "Analyse de positionnement et cartographie concurrentielle.",
            "Définition de segments cibles et recommandations stratégiques.",
          ],
        },
        {
          type: "Activité",
          title: "Co‑fondatrice – Sora Education",
          org: "Projet entrepreneurial",
          meta: ["Camps de jeunesse"],
          points: ["Études de marché et ajustement de l’offre et de la stratégie marketing."],
          actions: [{ label: "Voir activités", href: "#extracurricular" }],
        },
      ],
    },
    "prog-python": {
      title: "Python pour l’analyse de données",
      text:
        "Scripts Python pour nettoyer les données, produire des indicateurs et automatiser certaines analyses.",
      links: [
        {
          label: "Cours Programming 101 (Python) – NCCU",
          href: "#edu-nccu",
        },
      ],
    },
    "prog-r": {
      title: "R pour la recherche appliquée",
      text:
        "Utilisation de R pour l’analyse statistique, la visualisation et les études académiques.",
      links: [
        {
          label: "Cours Marketing Research & Research Methods (R)",
          href: "#edu-nccu",
        },
      ],
    },
    "prog-vba": {
      title: "Automatisation VBA & Excel",
      text:
        "Macros VBA et Access pour automatiser le traitement de données et les rapports.",
      links: [
        {
          label: "Introduction to Data Analysis and Programming (Excel VBA & Access)",
          href: "#edu-nccu",
        },
      ],
    },
    "prog-sql": {
      title: "SQL (requêtes de base)",
      text:
        "Écriture de requêtes SQL de base pour interroger et agréger des données.",
      links: [
        {
          label: "Projets académiques de data analysis",
          href: "#edu-nccu",
        },
      ],
    },
    "fin-green": {
      title: "Green finance & risk management",
      text:
        "Compréhension des enjeux de finance verte, de gestion des risques et de régulation.",
      links: [
        {
          label: "Cours « Green Finance and Risk Management »",
          href: "#exp-teaching",
        },
      ],
    },
    "fin-decision": {
      title: "Operational decision analysis",
      text:
        "Analyse de décisions pour les institutions financières, avec modélisation des risques et de la performance.",
      links: [
        {
          label:
            "Cours « Operational Decision Analysis and Management of Financial Institutions »",
          href: "#exp-teaching",
        },
      ],
    },
    "fin-international": {
      title: "International finance",
      text:
        "Fondamentaux de la finance internationale et des marchés de capitaux.",
      links: [
        {
          label: "Cours International Finance – NCCU",
          href: "#edu-nccu",
        },
      ],
    },
    "soft-communication": {
      title: "Communication & prise de parole",
      text:
        "Prise de parole en public en français, anglais et mandarin pour des événements académiques et culturels.",
      links: [
        {
          label: "Déléguée – Nuit des Idées",
          href: "#volunteer",
        },
        {
          label: "Clubs Toastmasters & activités de présentation",
          href: "#extracurricular",
        },
      ],
    },
    "soft-leadership": {
      title: "Leadership & gestion d’équipe",
      text:
        "Encadrement de petites équipes marketing et animation de groupes d’étudiants.",
      links: [
        {
          label: "Responsable marketing AIESEC – équipe de 4",
          href: "#volunteer",
        },
        {
          label: "Marketing & Membership Director – Guzheng Club",
          href: "#extracurricular",
        },
      ],
    },
    "soft-project": {
      title: "Gestion de projet & organisation",
      text:
        "Planification, coordination et suivi de projets académiques, d’événements et de camps.",
      links: [
        {
          label: "Sora Education – organisation de 5 camps d’été",
          href: "#extracurricular",
        },
        {
          label: "Organisation de séminaires et conférences (RA & TA)",
          href: "#exp-research",
        },
      ],
    },
    "soft-intercultural": {
      title: "Travail interculturel",
      text:
        "Collaboration dans des équipes et environnements multiculturels en France et à Taïwan.",
      links: [
        {
          label: "Buddy Program & Flagship Center",
          href: "#volunteer",
        },
      ],
    },
    "lang-english": {
      title: "English – IELTS 8.0 (C1)",
      text:
        "Niveau C1 attesté par IELTS 8.0, utilisé au quotidien en contexte académique et professionnel.",
      proofs: [
        {
          type: "Certificat",
          title: "IELTS 8.0 (C1)",
          org: "IELTS",
          meta: ["Anglais"],
          points: ["Certification C1."],
          actions: [
            { label: "Ouvrir le certificat", href: "certificates/IELTS%208_20241215.pdf" },
          ],
        },
        {
          type: "Formation",
          title: "Master in Management",
          org: "emlyon business school",
          meta: ["Lyon · France"],
          points: ["Cours et projets en environnement international."],
          actions: [{ label: "Voir la formation", href: "#edu-emlyon" }],
        },
      ],
    },
    "lang-french": {
      title: "Français – DALF C1",
      text:
        "Niveau C1 certifié en français, avec expérience d’études et de présentations en France.",
      proofs: [
        {
          type: "Certificat",
          title: "DALF C1",
          org: "France Éducation international",
          meta: ["Français"],
          points: ["Certification C1."],
          actions: [
            { label: "Ouvrir le certificat", href: "certificates/DALF%20C1_Certificate.pdf" },
          ],
        },
        {
          type: "Formation",
          title: "Programme d’échange",
          org: "Université Paris 1 Panthéon‑Sorbonne",
          meta: ["Paris · France", "01/2024 – 06/2024"],
          points: ["Immersion académique et culturelle en France."],
          actions: [{ label: "Voir la formation", href: "#edu-paris1" }],
        },
      ],
    },
    "lang-japanese": {
      title: "日本語 – JLPT N1",
      text:
        "Niveau avancé de japonais (JLPT N1), utile pour comprendre la culture et les marchés d’Asie de l’Est.",
      proofs: [
        {
          type: "Certificat",
          title: "JLPT N1",
          org: "JLPT",
          meta: ["Japonais"],
          points: ["Certification niveau avancé."],
          actions: [{ label: "Ouvrir le certificat", href: "certificates/JLPT%20N1.jpg" }],
        },
        {
          type: "Activité",
          title: "Kendo · Kyudo · Ikebana",
          org: "Clubs étudiants",
          meta: ["Culture japonaise"],
          points: ["Pratique et immersion culturelle."],
          actions: [{ label: "Voir activités", href: "#extracurricular" }],
        },
      ],
    },
    "lang-mandarin": {
      title: "中文 – langue maternelle",
      text:
        "Mandarin langue maternelle, utilisé pour des projets académiques, des présentations et des activités bénévoles.",
      proofs: [
        {
          type: "Langue",
          title: "Mandarin (langue maternelle)",
          org: "—",
          meta: ["Mandarin"],
          points: ["Utilisé au quotidien et dans des contextes académiques/bénévoles."],
          actions: [{ label: "Voir bénévolat", href: "#volunteer" }],
        },
      ],
    },
  };

  const previewContainer = document.querySelector(".skill-preview");
  const previewTitle = previewContainer?.querySelector(".skill-preview-title");
  const previewText = previewContainer?.querySelector(".skill-preview-text");
  const previewProofs = previewContainer?.querySelector(".skill-preview-proofs");

  function updateSkillPreview(key) {
    if (!previewContainer || !previewTitle || !previewText || !previewProofs)
      return;
    const data = skillData[key];
    if (!data) return;
    previewTitle.textContent = data.title;
    previewText.textContent = data.text;

    const proofs = Array.isArray(data.proofs)
      ? data.proofs
      : Array.isArray(data.links)
        ? data.links.map((l) => ({
            type: "Lien",
            title: l.label,
            org: "",
            meta: [],
            points: [],
            actions: [{ label: "Ouvrir", href: l.href }],
          }))
        : [];

    previewProofs.innerHTML = "";
    proofs.forEach((proof) => {
      const card = document.createElement("article");
      card.className = "proof-card";

      const top = document.createElement("div");
      top.className = "proof-top";

      const type = document.createElement("span");
      type.className = "proof-type";
      type.textContent = proof.type || "Preuve";

      top.appendChild(type);
      card.appendChild(top);

      const title = document.createElement("h4");
      title.className = "proof-title";
      title.textContent = proof.title || "";
      card.appendChild(title);

      const org = document.createElement("p");
      org.className = "proof-org";
      org.textContent = proof.org || "";
      card.appendChild(org);

      if (Array.isArray(proof.meta) && proof.meta.length) {
        const meta = document.createElement("div");
        meta.className = "proof-meta";
        proof.meta.forEach((m) => {
          const span = document.createElement("span");
          span.textContent = m;
          meta.appendChild(span);
        });
        card.appendChild(meta);
      }

      if (Array.isArray(proof.points) && proof.points.length) {
        const ul = document.createElement("ul");
        ul.className = "proof-points";
        proof.points.forEach((p) => {
          const li = document.createElement("li");
          li.textContent = p;
          ul.appendChild(li);
        });
        card.appendChild(ul);
      }

      if (Array.isArray(proof.actions) && proof.actions.length) {
        const actions = document.createElement("div");
        actions.className = "proof-actions";
        proof.actions.forEach((a) => {
          const link = document.createElement("a");
          link.href = a.href;
          link.textContent = a.label;
          actions.appendChild(link);
        });
        card.appendChild(actions);
      }

      previewProofs.appendChild(card);
    });
  }

  const skillChips = document.querySelectorAll(".skill-card[data-skill]");

  function setActiveSkill(key) {
    skillChips.forEach((c) =>
      c.classList.toggle("is-skill-active", c.getAttribute("data-skill") === key)
    );
  }

  skillChips.forEach((chip) => {
    chip.addEventListener("mouseenter", () => {
      const key = chip.getAttribute("data-skill");
      if (key) {
        setActiveSkill(key);
        updateSkillPreview(key);
      }
    });
  });

  // Skill area filters (inside #skills)
  const skillsSection = document.getElementById("skills");
  const skillAreaFilters = skillsSection?.querySelectorAll("[data-skill-area]") || [];
  const skillsBlocks = skillsSection?.querySelectorAll(".skills-block[data-skill-area]") || [];

  function applySkillArea(area) {
    skillsBlocks.forEach((block) => {
      const blockArea = block.getAttribute("data-skill-area") || "all";
      const show = area === "all" || blockArea === area;
      block.style.display = show ? "" : "none";
    });
  }

  if (skillsSection && skillAreaFilters.length) {
    skillAreaFilters.forEach((btn) => {
      btn.addEventListener("click", () => {
        const area = btn.getAttribute("data-skill-area") || "all";
        skillAreaFilters.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        applySkillArea(area);
      });
    });

    applySkillArea("all");
    setActiveSkill("data-core");
    updateSkillPreview("data-core");
  }

  // Experience filters
  const experienceSection = document.getElementById("experience");
  const experienceFilters =
    experienceSection?.querySelectorAll(".experience-filter[data-vibe]") || [];
  const experienceList = experienceSection?.querySelector("[data-experience-list]");
  const viewAllBtn = experienceSection?.querySelector("[data-view-all]");

  function applyExperienceFilter(vibe) {
    if (!experienceList) return;
    const items = Array.from(experienceList.querySelectorAll(".timeline-item"));
    items.forEach((item) => {
      const itemVibe = item.getAttribute("data-vibe") || "all";
      const shouldShow = vibe === "all" || itemVibe === vibe;
      item.style.display = shouldShow ? "" : "none";
    });

    if (viewAllBtn) {
      viewAllBtn.hidden = vibe === "all";
    }
  }

  if (experienceFilters.length && experienceList) {
    experienceFilters.forEach((btn) => {
      btn.addEventListener("click", () => {
        const vibe = btn.getAttribute("data-vibe") || "all";
        experienceFilters.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        applyExperienceFilter(vibe);
      });
    });

    if (viewAllBtn) {
      viewAllBtn.addEventListener("click", () => {
        experienceFilters.forEach((b) => {
          b.classList.toggle("is-active", b.getAttribute("data-vibe") === "all");
        });
        applyExperienceFilter("all");
      });
    }

    applyExperienceFilter("all");
  }

  // Extracurricular filters (inside #extracurricular)
  const extraSection = document.getElementById("extracurricular");
  const extraFilters = extraSection?.querySelectorAll("[data-extra]") || [];
  const extraList = extraSection?.querySelector("[data-extracurricular-list]");
  const extraViewAllBtn = extraSection?.querySelector("[data-extra-view-all]");

  function applyExtraFilter(key) {
    if (!extraList) return;
    const items = Array.from(extraList.querySelectorAll(".timeline-item"));
    items.forEach((item) => {
      const vibe = item.getAttribute("data-extra") || "all";
      item.style.display = key === "all" || vibe === key ? "" : "none";
    });

    if (extraViewAllBtn) extraViewAllBtn.hidden = key === "all";
  }

  if (extraSection && extraFilters.length && extraList) {
    extraFilters.forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-extra") || "all";
        extraFilters.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        applyExtraFilter(key);
      });
    });

    if (extraViewAllBtn) {
      extraViewAllBtn.addEventListener("click", () => {
        extraFilters.forEach((b) =>
          b.classList.toggle("is-active", b.getAttribute("data-extra") === "all"),
        );
        applyExtraFilter("all");
      });
    }

    applyExtraFilter("all");
  }

  // ── Scroll progress bar ───────────────────────────────
  const progressBar = document.getElementById("scroll-progress");
  if (progressBar) {
    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + "%";
    }
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
  }

  // ── Scroll reveal ─────────────────────────────────────
  const revealEls = document.querySelectorAll("[data-reveal]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (revealEls.length) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -48px 0px" }
      );
      revealEls.forEach((el) => {
        const siblings = Array.from(el.parentElement?.children || []).filter(
          (c) => c.hasAttribute("data-reveal")
        );
        const idx = siblings.indexOf(el);
        if (idx > 0) el.style.transitionDelay = idx * 75 + "ms";
        revealObserver.observe(el);
      });
    }
  }

  // ── Active nav on scroll ──────────────────────────────
  const desktopNavLinks = document.querySelectorAll(".site-nav a[href^='#']");
  const navSections = Array.from(desktopNavLinks)
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if (navSections.length && "IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            desktopNavLinks.forEach((a) =>
              a.classList.toggle("is-current", a.getAttribute("href") === "#" + entry.target.id)
            );
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    navSections.forEach((s) => navObserver.observe(s));
  }

  // ── Hero card mouse tilt ──────────────────────────────
  if (!prefersReducedMotion) {
    const heroCard = document.querySelector(".hero-card");
    if (heroCard) {
      heroCard.addEventListener("mousemove", (e) => {
        const rect = heroCard.getBoundingClientRect();
        const dx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const dy = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        heroCard.style.transform = `perspective(900px) rotateY(${dx * 5}deg) rotateX(${-dy * 4}deg)`;
      });
      heroCard.addEventListener("mouseleave", () => {
        heroCard.style.transform = "";
      });
    }
  }
});

