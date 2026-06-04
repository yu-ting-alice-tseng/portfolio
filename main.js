document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = String(new Date().getFullYear());
  }

  // Fix corrupted PDF hrefs (encoding artifact from prior file operation)
  document.querySelectorAll('a[href*="250508_"]').forEach(a => {
    if (!a.href.includes("作品集")) {
      a.setAttribute("href", "assets/250508_作品集_社群經營與設計_c.pdf");
    }
  });

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

    // Mobile nav sub-dropdown toggle
    mobileNav.querySelectorAll(".mobile-nav-toggle-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const sub = btn.nextElementSibling;
        if (!sub) return;
        const open = sub.classList.toggle("is-open");
        btn.classList.toggle("is-open", open);
      });
    });
  }

  // Desktop nav dropdown — click-toggle
  document.querySelectorAll(".nav-item--has-dropdown").forEach((item) => {
    const btn = item.querySelector(".nav-dropdown-toggle");
    if (!btn) return;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(isOpen));
      // close others
      document.querySelectorAll(".nav-item--has-dropdown").forEach((other) => {
        if (other !== item) {
          other.classList.remove("is-open");
          const otherBtn = other.querySelector(".nav-dropdown-toggle");
          if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
        }
      });
    });
    // close on outside click
    document.addEventListener("click", () => {
      item.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    });
    // close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        item.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      }
    });
    // close when a dropdown link is clicked
    item.querySelectorAll(".nav-dropdown a").forEach((link) => {
      link.addEventListener("click", () => {
        item.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      });
    });
  });

  // Language switcher (FR / EN)
  const translations = {
    fr: {
      brandName: "Yu‑Ting Tseng",
      a11y: { skipLink: "Aller au contenu" },
      simpleNav: {
        resume: "Résumé",
        viewPortfolioPdf: "Portfolio (PDF)",
        langMandarin: "Mandarin",
        langMandarinCert: "Langue maternelle",
        langFrench: "Français",
        langEnglish: "Anglais",
        langJapanese: "Japonais",
        deepDiveMarketing: "→ Page Marketing",
        deepDiveData: "→ Page Data",
        deepDiveLabel: "Pages détaillées par domaine :",
        aiesecDesc: "Pilotage de l'équipe marketing (4 personnes) pour le camp international YOLO. Création des visuels principaux pour le recrutement de volontaires et de participants.",
        kpnDesc: "Optimisation SEO on-page et technique, suivi de KPIs (trafic, CTR, conversions) via Google Analytics et reporting de campagnes SEA.",
        footerExtra: "Marketing digital · Data · Consulting",
        teaching: "Enseignement",
        online: "En ligne",
        translation: "Traduction",
        proofreading: "Correction",
        language: "Langue",
        mentoring: "Mentorat",
        immersion: "Immersion",
        intercultural: "Interculturel",
        exchange: "Échange",
        speaking: "Prise de parole",
        bilingual: "Bilingue",
        volunteer: "Bénévolat",
        social: "Impact social",
        entrepreneurship: "Entrepreneuriat",
        strategy: "Stratégie",
        leadership: "Leadership",
        marketing: "Marketing",
        clubs: "Clubs",
        culture: "Culture",
        data: "Data",
        research: "Recherche",
      },
      nav: {
        about: "À propos",
        skills: "Compétences",
        education: "Formation",
        experience: "Expériences Professionnelles",
        portfolio: "Portfolio",
        extracurricular: "Expériences Extra-scolaires",
        volunteer: "Bénévolat",
        honors: "Distinctions",
        projects: "Projets",
        contact: "Contact",
        teaching: {
          languages: "Langues",
          services: "Services",
          expTeaching: "Expériences Professionnelles",
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
        chipEnglish: "Anglais – IELTS 8.0 (C1)",
        chipFrench: "Français – DALF C1",
        chipJapanese: "Japonais – JLPT N1",
        chipMandarin: "Mandarin – Langue Maternelle",
        chipMandarinNative: "Mandarin – Langue Maternelle",
        filterData: "Data & Analytics",
        filterMarketing: "Marketing Digital",
        filterConsulting: "Consulting & Stratégie",
        filterFinance: "Finance",
        filterSoft: "Soft Skills",
        filterLanguages: "Langues",
        blockData: "Data & Analytics",
        blockMarketing: "Marketing Digital",
        blockConsulting: "Consulting & Stratégie",
        blockFinance: "Finance",
        blockSoft: "Soft Skills",
        blockLanguages: "Langues",
        subData1: "Langages & Requêtes",
        subDataTools: "Outils & Applications",
        subData2: "Dashboards & Visualisation",
        subData3: "Méthodes & Analyse",
        subDataQuant: "Méthodes Quantitatives",
        subDataQual: "Méthodes Qualitatives & Analyse",
        subData4: "IA & Outils",
        subMkt1: "Acquisition & Performance",
        subMkt2: "Social Media & Contenu",
        subMkt3: "Stratégie & Planification",
        subCons1: "Analyse Stratégique",
        subCons2: "Business & Présentation",
        subFin1: "Cours & Fondamentaux",
        subFin2: "Analyse & Contrôle de Gestion",
        subSoft1: "Collaboration",
        subSoft2: "Leadership & Organisation",
        subSoft3: "Communication",
        chipStatistics: "Statistiques & Méthodes Quantitatives",
        chipDesign: "Création De Contenu & Design Visuel",
        chipResearch: "Études De Marché & Positionnement",
        chipCampaign: "Planification De Campagnes",
        chipIntercultural: "Travail Interculturel",
        chipLeadership: "Leadership & Gestion D'Équipe",
        chipProject: "Gestion De Projet & Organisation",
        chipComm: "Communication & Prise De Parole",
        chipAiTools: "Outils IA (ChatGPT, Claude, Gemini)",
        chipAiAds: "Publicité Assistée par l'IA",
        chipAiBusiness: "IA Pour Les Affaires",
        subtitleMarketing: "Marketing digital, création de contenu, outils data et IA pour le marketing.",
        subtitleData: "Langages, outils, méthodes quantitatives et recherche de marché.",
        subtitleFinance: "Outils analytiques, fondamentaux financiers et compétences stratégiques.",
        blockAI: "Outils IA",
        blockOffice: "Suite Bureautique",
        blockCreative: "Outils Créatifs",
        chipChatGPT: "ChatGPT",
        chipClaude: "Claude",
        chipGemini: "Gemini",
        chipVibeCoding: "Vibe Coding",
        chipMicrosoftOffice: "Microsoft Office (Word · Excel · PowerPoint)",
        chipGoogleSuite: "Google Suite",
        chipNotion: "Notion",
        subCreativeGraphic: "Design Graphique",
        subCreativeVideo: "Montage Vidéo",
        filterAI: "IA & Digital",
        filterOffice: "Bureautique",
        blockDataMarketing: "Data pour le Marketing",
      },
      tags: {
        leadership: "Leadership",
        marketing: "Marketing",
        visualDesign: "Design visuel",
        competition: "Concours",
        teaching: "Enseignement",
        online: "En ligne",
        translation: "Traduction",
        proofreading: "Correction",
        language: "Langue",
        mentoring: "Mentorat",
        immersion: "Immersion",
        intercultural: "Interculturel",
        exchange: "Échange",
        speaking: "Prise de parole",
        bilingual: "Bilingue",
        volunteer: "Bénévolat",
        social: "Impact social",
        entrepreneurship: "Entrepreneuriat",
        strategy: "Stratégie",
        clubs: "Clubs",
        culture: "Culture",
        data: "Data",
        research: "Recherche",
      },
      locations: {
        online: "En ligne · Taïwan",
        taipei: "Taipei · Taïwan",
        taipeiEdu: "Taipei, Taïwan",
        lyon: "Lyon, France",
        paris: "Paris, France",
        onlineOnly: "En ligne",
        freelance: "Freelance",
      },
      footer: {
        rights: "Tous droits réservés.",
        overview: "Vue générale",
        marketing: "Marketing digital & Création",
        data: "Data & Recherche de marché",
        finance: "Finance & Conseil",
      },
      education: {
        title: "Formation Académique",
        subtitle:
          "Un parcours international entre la France et Taïwan, à l’interface du management, de la finance et des langues.",
        emlyon: {
          period: "09/2023 – Aujourd’hui",
          title: "Master en Gestion (Programme Grande École)",
          school: "emlyon business school",
          point1: "Spécialisation en Finance et Comptabilité.",
          pointEn: "Programme dispensé entièrement en anglais.",
          gpa: "4,0/4,0",
          specLabel: "Spécialisation",
          spec1: "Finance & Comptabilité",
        },
        nccu: {
          period: "09/2020 – 06/2025",
          title: "Bachelor en Français & Diplomatie",
          school: "Université Nationale Chengchi (NCCU)",
          majorLabel: "Majeure",
          minorLabel: "Mineure",
          major1: "Langues et Cultures Européennes : Parcours Français",
          major2: "Diplomatie",
          minor1: "Économie",
          point1: "Certificate of Excellence (Top 7% GPA) – 2021, 2023.",
          point2: "Vice-présidente du Comité Local AIESEC in NCCU.",
          gpa: "3,99 / 4,0",
          statRanking: "Classement",
          courseManagement: "Management",
          courseDataAnalysis: "Analyse de données & Programmation (VBA & Access)",
          coursePython: "Programmation 101 (Python)",
          courseResearch: "Méthodes de recherche (R & Statistiques)",
          courseMarketing: "Études de marché (R, Decanter AI)",
          courseFinance: "Finance internationale",
        },
        paris1: {
          period: "01/2024 – 06/2024",
          title: "Programme d’échange en Science Politique",
          school: "Université Paris 1 Panthéon‑Sorbonne",
          point1: "Approfondissement des politiques européennes et internationales.",
          point2: "Immersion académique et culturelle en France.",
          course1: "Science politique",
          course2: "Relations internationales",
          course3: "Politiques européennes",
          typeLabel: "Échange",
          typeDomain: "Science politique & Relations internationales",
        },
        coursesLabel: "Cours pertinents",
      },
      pageSwitcher: {
        business: "Business",
        teaching: "Enseignement",
      },
      chapters: {
        aboutMe: "À propos de moi",
        aboutMeDesc: "Mes qualifications, expériences et parcours pour vous aider à évaluer votre enseignante.",
        teachingService: "Services d'enseignement",
        teachingServiceDesc: "Ce que je propose et comment réserver votre premier cours.",
        learningResources: "Ressources pédagogiques",
        learningResourcesDesc: "Outils, conseils et supports sélectionnés pour progresser entre les cours.",
      },
      booking: {
        title: "Réserver un cours",
        subtitle: "Remplissez ce formulaire pour me contacter. Je vous répondrai sous 24h pour confirmer le créneau.",
        navCta: "Réserver un cours",
        durationLabel: "Durée",
        durationValue: "Personnalisable — 30 / 45 / 60 / 90 min selon vos besoins",
        materialsLabel: "Matériaux pédagogiques",
        materialsValue: "Supports créés par moi-même, ou matériaux choisis par l'élève — c'est vous qui décidez.",
        formatLabel: "Format",
        formatValue: "En ligne (Zoom / Google Meet)",
        langLabel: "Langues de cours",
        langValue: "Anglais · Français · Mandarin",
        responseLabel: "Réponse",
        responseValue: "Sous 24h via email ou Line",
        fieldName: "Votre prénom & nom",
        fieldNamePh: "Alice Martin",
        fieldContact: "Méthode de contact préférée",
        contactHint: "Laissez votre email ou votre ID Line — je vous répondrai sous 24h.",
        fieldEmail: "Email",
        fieldEmailPh: "alice@exemple.com",
        fieldLine: "Line ID",
        fieldLinePh: "votre_line_id",
        fieldType: "Type de cours souhaité",
        optionSelect: "-- Choisir --",
        optionIelts: "Préparation IELTS",
        optionCambridge: "Cambridge / GEPT",
        optionGrades: "Anglais scolaire",
        optionSkill: "Compétence ciblée",
        optionOther: "Autre",
        fieldDuration: "Durée souhaitée",
        dur30: "30 min",
        dur45: "45 min",
        dur60: "60 min (recommandé)",
        dur90: "90 min",
        durCustom: "Autre durée — je précise dans le message",
        fieldMaterials: "Matériaux préférés",
        matTeacher: "Supports préparés par l'enseignante",
        matStudent: "Matériaux que j'apporte moi-même",
        matBoth: "Combinaison des deux",
        fieldSlot: "Créneaux préférés",
        fieldSlotPh: "Ex : lundi 18h–20h, samedi matin",
        fieldMsg: "Message (facultatif)",
        fieldMsgPh: "Parlez-moi de votre niveau, vos objectifs ou vos questions.",
        submit: "Envoyer la demande",
        formNote: "Ce formulaire est une démonstration front‑end. Connectez‑le à Formspree ou Netlify Forms pour l'activer.",
      },
      resources: {
        title: "Ressources pédagogiques",
        subtitle: "Des outils gratuits et fiables pour pratiquer l'anglais, le français ou le mandarin entre les cours.",
        tabEn: "🇬🇧 Anglais",
        tabFr: "🇫🇷 Français",
        tabZh: "🇨🇳 Mandarin",
        websitesTitle: "Sites web & applications",
        tipsTitle: "Conseils d'apprentissage",
        videosTitle: "Ressources vidéo",
        bbc: "Leçons, vidéos et quiz gratuits pour tous les niveaux.",
        cambridge: "Matériaux officiels de préparation aux examens Cambridge.",
        ieltsOfficial: "Sujets d'entraînement et guides de préparation officiels de l'IELTS.",
        quizlet: "Flashcards et jeux de vocabulaire — idéal pour mémoriser des listes de mots.",
        tip1title: "Écoutez chaque jour",
        tip1: "Même 10 minutes de podcasts ou de YouTube en anglais améliore votre oreille plus vite qu'un manuel.",
        tip2title: "Écrivez, puis relisez",
        tip2: "Rédigez un court paragraphe chaque jour. Apportez-le en cours — nous le corrigerons ensemble.",
        tip3title: "Répétition espacée",
        tip3: "Révisez les nouveaux mots à intervalles croissants (1 jour → 3 jours → 1 semaine). Utilisez Quizlet ou Anki.",
        tip4title: "Parlez à voix haute",
        tip4: "Lisez des passages à voix haute, imitez des locuteurs natifs ou enregistrez-vous. L'aisance à l'oral s'améliore en parlant.",
        bbcYt: "Courtes vidéos sur la grammaire, le vocabulaire et la prononciation.",
        duncan: "Cours en direct en format long — idéal pour les apprenants intermédiaires.",
        ted: "Écoute avancée sur des sujets passionnants — utilisez la fonction transcription.",
      },
      pageNav: {
        home: "Accueil",
        overview: "Vue générale",
        finance: "Finance & Conseil",
        marketing: "Marketing",
        teaching: "Enseignement",
        data: "Data & Recherche",
      },
      financeHero: {
        kicker: "Finance · Comptabilité · Conseil Stratégique",
        title1: "Allier",
        title2: "rigueur analytique et vision stratégique",
        summary: "Étudiante en Master à emlyon business school avec un double parcours Économie/Gestion, je développe une expertise forte en modélisation, en gestion des risques et en résolution de problèmes complexes. Rigoureuse, analytique et dotée d'une solide maîtrise d'Excel et de la business intelligence, je structure les analyses pour accompagner la transformation et la création de valeur.",
        ctaPrimary: "Me contacter",
        ctaSecondary: "Voir mes expériences",
        cardRole: "Finance & Comptabilité",
        caseStudyLabel: "Expérience clé · Finance & Enseignement",
        caseStudyTitle: "Assistante d'enseignement – Finance & Risk Management",
        caseStudyDesc: "Support pédagogique pour les cours de finance et gestion des risques au College of Global Banking and Finance (NCCU). Accompagnement des étudiants, préparation de supports et coordination sur deux mandats.",
      },
      marketingHero: {
        kicker: "Marketing 360 · Activation · Contenu",
        title1: "Donner de l'impact aux marques, ",
        title2: "de la stratégie à l'activation",
        summary: "Étudiante en Master à emlyon business school, je combine vision stratégique et exécution opérationnelle pour animer les marques. Forte d'expériences concrètes en marketing digital (réseau sociaux : +93% de vues ; campagnes publicitaires : +9,5% CTR, +5,1% CVR ) et d'une double culture franco-asiatique, je mets la créativité et l'analyse de données au service de la performance de vos campagnes.",
        ctaPrimary: "Voir mes créations",
        ctaSecondary: "Me contacter",
        cardRole: "Marketing 360",
        caseStudyLabel: "Étude de cas · Engoo XHS",
        caseStudyTitle: "Dashboard Analytics & Croissance Xiaohongshu",
        caseStudyS: "Situation : Engoo gérait son compte Xiaohongshu sans outil de mesure centralisé, rendant impossible la quantification de l'engagement et l'optimisation du ROI du contenu.",
        caseStudyA: "Action : Conception d'un dashboard Excel dynamique (Tableaux Croisés, Formules imbriquées) permettant une comparaison A/B automatique des périodes pour piloter la stratégie STP.",
        caseStudyR: "Résultat : Automatisation du reporting (gain de 5h/semaine) et croissance de 89% des interactions grâce à l'identification des formats visuels gagnants.",
        caseStudyInsight1: "• Les miniatures de type 'Educational Tips' génèrent un CTR 25% supérieur aux 'Life Hacks'.",
        caseStudyInsight2: "• Le 'Golden Time' de publication pour le segment cible se situe entre 19h et 21h.",
        caseStudyTemplate: "Consulter le modèle interactif (Excel)",
      },
      dataHero: {
        kicker: "Analyse de Données · Informatique Décisionnelle · Strétegie Commerciale",
        title1: "Des données brutes aux",
        title2: "insights actionnables.",
        summary: "Étudiante en Master à emlyon business school, je me passionne pour l'intersection entre les chiffres et la stratégie d'entreprise. Maîtrisant les outils d'analyse (Excel/TOSA 950, SQL, Power BI, Python), je transforme les données complexes en tableaux de bord actionnables pour optimiser les performances commerciales et piloter les décisions.",
        ctaPrimary: "Télécharger le dashboard (Excel)",
        ctaSecondary: "Voir mes expériences",
        cardRole: "Analyse de Données & Informatique Décisionnelle",
        caseStudyLabel: "Étude de cas · Dashboard XHS",
        caseStudyTitle: "Dashboard Excel – Performance Xiaohongshu",
        caseStudyDesc: "Construction d'un tableau de bord Excel complet pour suivre 12 métriques quotidiennes du compte Xiaohongshu d'Engoo : KPIs, évolution temporelle et comparaison A/B de périodes.",
      },
      teachingHero: {
        kicker: "Langues & engagement international",
        title1: "Immersion linguistique &",
        title2: "échange interculturel",
        summary: "Locutrice native en mandarin, certifiée DALF C1 (français), IELTS 8.0 (anglais) et JLPT N1 (japonais). Engagée dans des programmes d’accompagnement linguistique et d’échange culturel à Taïwan.",
        ctaSecondary: "Voir mes engagements",
        availabilityLabel: "Enseignement",
        availabilityValue: "En ligne · Disponible",
      },
      teachingLanguages: {
        title: "Compétences linguistiques",
        subtitle: "Certifications officielles et pratique quotidienne dans quatre langues.",
      },
      teachingServices: {
        title: "Services d'Enseignement",
        subtitle: "Des cours personnalisés, dans un environnement détendu et bienveillant, pour progresser à son propre rythme.",
        philosophy: "Dans chaque cours, j'adapte mes méthodes à l'élève : <strong>jeux</strong>, <strong>exercices ciblés</strong> et <strong>échanges interactifs</strong> pour rendre l'apprentissage naturel et durable.",
        ielts: {
          title: "Préparation à l'IELTS",
          desc: "Coaching complet pour les 4 modules. Stratégies de test, entraînement intensif et simulations d'examen, avec un suivi personnalisé de la progression.",
          tag1: "Reading & Writing",
          tag2: "Speaking & Listening",
          tag3: "Stratégies d'Examen",
          tag4: "Score Visé 6.0 – 8.0+",
        },
        grades: {
          title: "Anglais Tous Niveaux",
          desc: "Cours adaptés au programme scolaire taïwanais pour élèves du primaire au lycée. Grammaire, vocabulaire, compréhension et expression.",
          tag1: "Primaire",
          tag2: "Collège",
          tag3: "Lycée",
          tag4: "Renforcement Scolaire",
        },
        exams: {
          title: "Certifications Cambridge & 英檢",
          desc: "Préparation structurée aux examens officiels Cambridge et au GEPT (全民英檢). Entraînement sur annales et méthodes pour chaque épreuve.",
          tag1: "YLE (Children)",
          tag2: "A2 Key / B1 Preliminary",
          tag3: "B2 First",
          tag4: "全民英檢 GEPT",
        },
        skills: {
          title: "Renforcement D'Une Compétence Ciblée",
          desc: "Travail ciblé sur une compétence spécifique : rédaction, lecture, expression orale, grammaire ou préparation aux rédactions scolaires.",
          tag1: "Writing",
          tag2: "Reading",
          tag3: "Speaking",
          tag4: "Grammaire & Vocabulaire",
        },
      },
      teachingExp: {
        title: "Expériences D'Enseignement",
        subtitle: "Cours en ligne, préparation aux certifications et services de traduction.",
        translation: {
          period: "2022 – 2024",
          title: "Traductrice & Correctrice (Freelance)",
          company: "Freelance · Projets Académiques & Éditoriaux",
          point1: "Traduction de documents académiques et de contenus professionnels entre le chinois, l'anglais et le français.",
          point2: "Correction et relecture de thèses, articles et supports de communication pour des étudiants et entreprises.",
        },
      },
      teachingEngagement: {
        title: "Engagement linguistique & international",
        subtitle: "Programmes de mentorat linguistique, immersion culturelle et échanges internationaux.",
      },
            experience: {
        title: "Expériences Professionnelles",
        subtitle:
          "Une sélection de mes expériences en marketing digital, analyse de données et gestion de projet.",
        kpn: {
          period: "01/2025 – 06/2025",
          title: "Assistante Marketing Digital",
          point1: "Optimisation SEO (on-page / technique) et recommandations de contenus.",
          point2: "Suivi de KPIs et analyse de performance (trafic, CTR, conversions).",
          point3: "Campagnes SEA et reporting.",
          dataPoint1: "Piloter un projet de recherche quantitative pour identifier les leviers de performance digitale et synthétiser les données en recommandations stratégiques pour l’équipe.",
          dataPoint2: "Concevoir et piloter des reportings de performance marketing (FB & Google) via des tableaux de bord — +9,5% CTR, +5,1% CVR.",
          dataPoint3: "Réaliser des benchmarks concurrentiels approfondis et suivre les KPIs (trafic, CTR, conversions) via Google Analytics & Search Console.",
          finTitle: "Assistante Marketing Digital (Stage)",
          finCompany: "KPN (Agence de marketing digital – SEO, SEM, publicité Facebook & Google)",
          finPoint1: "Gestion des budgets publicitaires mensuels sur Facebook et Google Ads, suivi des métriques ROI et allocation efficace du capital pour optimiser le coût par acquisition (taux de conversion +5,1%).",
          finPoint2: "Réalisation d’audits de performance mensuels sur les sites web, analyse des écarts clés et collaboration avec les équipes transverses pour identifier et résoudre les problèmes.",
        },
        engoo: {
          period: "10/2024 – 02/2025",
          title: "Assistante Marketing",
          point1: "Stratégie de contenu Xiaohongshu basée sur le modèle STP et A/B testing – +89.1% d’interactions et +69.7% d’abonnés en 3 mois.",
          point2: "Veille concurrentielle, analyse d’audience et adaptation des visuels par sous-segment cible.",
          point3: "Création de contenus Meta (Facebook & Instagram) alignés avec les tendances et la marque.",
          dataPoint1: "Construire un dashboard Excel dynamique — 12 métriques quotidiennes, comparaison A/B automatisée et visualisation des KPIs — réduisant le temps de reporting de 5h/semaine.",
          dataPoint2: "Réaliser des analyses de marché approfondies et une veille concurrentielle pour optimiser la stratégie de contenu sur le segment du chinois simplifié (REDnote / Xiaohongshu).",
          dataPoint3: "Déployer une stratégie de contenu data-driven fondée sur le modèle STP — +93,3% de vues, +89,1% d’interactions et +69,7% d’abonnés en 3 mois.",
          finTitle: "Assistante Marketing (Stage)",
          finCompany: "Engoo, DMM.com (Plateforme internationale de cours de langue en ligne)",
          finPoint1: "Analyse de marché approfondie pour développer et affiner les stratégies marketing sur le segment du chinois simplifié.",
          finPoint2: "Gestion des métriques de performance et de contenu sur Xiaohongshu — +93,3% de vues, +89,1% d’interactions et +69,7% d’abonnés en 3 mois.",
          pythonPoint: "Développement d’un script Python d’automatisation de la consolidation de données quotidiennes, améliorant l’efficacité du processus de reporting chaque jour.",
          portfolioLink: "Voir les créations (PDF)",
          excelLink: "Télécharger le tableau de bord XHS (Excel)",
          excelHref: "assets/Engoo_XHS Dashboard_FR.xlsx",
          stat1: "Vues",
          stat2: "Abonnés",
          stat3: "Interactions",
          screenshot1: "assets/Engoo Dashboard_FR.png",
          screenshot2: "assets/Engoo Data_FR.png",
          screenshotAlt1: "Tableau de bord de performance – Engoo XHS",
          screenshotAlt2: "Données brutes – Engoo XHS",
          showcaseLabel: "Livrables · Dashboard XHS",
          showcaseBadge1: "📊 Évaluation générale",
          showcaseTitle1: "Vue d'ensemble · 30 derniers jours",
          showcaseDesc1: "Section gauche : KPIs principaux (vues, abonnés, engagement, notoriété) et graphiques d'évolution sur la période sélectionnée.",
          showcaseBadge2: "⚖️ Comparaison A/B",
          showcaseTitle2: "30 jours vs 30 jours précédents",
          showcaseDesc2: "Section droite : courbe Période A vs Période B pour identifier les tendances et l'impact des actions menées.",
          showcaseBadge3: "📋 Données brutes",
          showcaseTitle3: "Jeu de données quotidiennes",
          showcaseDesc3: "12 métriques par jour (vues, temps de visionnage, engagement, notoriété…) — base structurée de toutes les visualisations.",
        },
        teaching: {
          period: "07/2023 – 12/2023 · 07/2024 – 04/2025",
          title: "Assistante d’enseignement",
          point1: "Support de cours (finance, risk management) et suivi des étudiants.",
          point2: "Préparation de supports et coordination logistique.",
          dataSupport: "Support pédagogique pour les cours de programmation et analyse de données (VBA, Access).",
          dataCoord: "Coordonner la logistique opérationnelle de 9 cours et assurer l’interface entre des parties prenantes exigeantes.",
          finTitle: "Assistante de cours",
          finCompany: "Faculté de Banque et Finance Internationale, NCCU",
          finPoint1: "Coordination logistique de 9 cours de finance, en assurant l’interface entre les étudiants, les enseignants et les partenaires entreprise.",
          finPoint2: "Animation d’événements de networking et de briefings, dans le respect des réglementations universitaires et gestion de plannings multi-parties prenantes sous contrainte de temps.",
        },
        research: {
          period: "06/2023 – 12/2023",
          title: "Assistante de recherche",
          point1: "Collecte, nettoyage et analyse de données pour des travaux de recherche.",
          point2: "Préparation de synthèses et supports pour séminaires.",
          dataPoint1: "Analyser les enjeux macro-économiques par une double approche quantitative et qualitative via R et Excel, garantissant la rigueur des livrables.",
          dataPoint2: "Collecte, nettoyage et traitement de données ; préparation de synthèses quantitatives et supports pour séminaires et conférences.",
          finCompany: "Institut des Relations Internationales, NCCU",
          finPoint1: "Analyse des tendances économiques et de jeux de données via des méthodes qualitatives (enquêtes) et quantitatives (régressions).",
        },
        tutorABC: {
          period: "08/2024 – Présent",
          title: "Professeure particulière d'anglais en ligne",
          point1: "Cours particuliers d'anglais en ligne pour apprenants de niveaux variés (primaire au lycée).",
          point2: "Préparation aux certifications IELTS et Cambridge English (YLE, A2 Key, B1 Preliminary, B2 First).",
          coursesLabel: "Cours dispensés",
          courseGradeSchool: "Anglais (primaire)",
          courseMiddle: "Anglais (collège)",
          courseHigh: "Anglais (lycée)",
          stat1: "Jours",
          stat2: "Élèves",
          stat3: "Sessions",
          stat4: "Abonnés",
          stat5: "TTT",
        },
        filterAll: "Toutes",
        filterTeaching: "Enseignement",
        filterFinance: "Finance",
        filterMarketing: "Marketing",
        viewAll: "Voir tout",
        subtitleFinance: "Finance, analyse de données et conseil stratégique.",
        subtitleMarketing: "Social media, performance marketing, création de contenu et engagement communautaire.",
        subtitleData: "Analyse de données, tableaux de bord et études de marché.",
      },
      portfolio: {
        title: "Portfolio – Social Media & Design",
        subtitle: "Exemples concrets de contenus créés, de campagnes gérées et de travaux visuels.",
        viewPdf: "Voir le portfolio complet (PDF)",
        engooCard: { dashboardDesc: "12 métriques / jour · Séries temporelles · Comparaison A/B de périodes." },
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
        packaging: {
          title: "包裝設計競賽 – 18th Penwards",
          desc: "Participation à la 18e édition du concours de design d’emballage Penwards (2024). Création de visuels promotionnels pour l’appel à participation.",
        },
        insightLbl: "Insights métier",
        mkt: {
          heroEyebrow: "Yu-Ting Tseng · Projets sélectionnés · 2024–2025",
          heroDesc: "Campagnes data-driven, direction artistique et community management — des projets où créativité visuelle et analyse de performance se croisent.",
          heroStatProjets: "Projets",
          heroStatGrowth: "Croissance XHS",
          heroStatPart: "Participants AIESEC",
          filterAll: "Tous",
          filterDashboard: "Dashboard & Data",
          filterCampagne: "Campagnes",
          filterDesign: "Design visuel",
          filterCommunity: "Community",
          engoo: {
            num: "01 · Étude de cas complète",
            tag: "Dashboard Excel · Social Analytics · A/B Testing",
            sitLbl: "Situation · Contexte & Défi",
            actLbl: "Action · Construction du dashboard",
            resLbl: "Résultats · Impact sur 3 mois",
            statMet: "Métriques / jour",
            statVues: "Vues · 3 mois",
            statInter: "Interactions",
            statAb: "Module A/B dynamique",
          },
          aiesec: {
            num: "02 · Campagne Marketing",
            tag: "Campagne · Direction artistique",
            body: "Pilotage de l’équipe marketing (4 personnes) pour le camp international YOLO d’AIESEC in NCCU. Conception des visuels de campagne — affiches et publications — pour le recrutement de volontaires et de participants.",
            statVol: "Volontaires recrutés",
            statPart: "Participants",
            statBudget: "Objectif budgétaire dépassé",
          },
          guzhengNum: "03 · Community Management",
          penwardsNum: "04 · Design Visuel",
          penwardsTag: "Design · Concours",
          footerBack: "← Retour à Marketing",
          footerNext: "Portfolio Data & Recherche →",
        },
        data: {
          heroDesc: "Tableaux de bord Excel, analyses quantitatives et études de marché — la rigueur analytique au service de décisions actionnables.",
          heroStatProjets: "Projets",
          heroStatGrowth: "Croissance XHS",
          heroStatHypo: "Hypothèses M&A",
          filterAll: "Tous",
          filterDashboard: "Dashboard",
          filterAnalyse: "Analyse",
          filterRecherche: "Recherche",
          filterReporting: "Reporting",
          dashboard: {
            num: "01 · Dashboard · Étude de cas",
            sitLbl: "Situation · Problème analytique",
            actLbl: "Action · Architecture du dashboard",
            resLbl: "Résultats · Impact mesuré sur 3 mois",
            statMet: "Métriques / jour",
            statVues: "Vues · 3 mois",
            statAb: "Comparaison A/B dynamique",
          },
          ma: {
            num: "02 · Recherche empirique · Finance quantitative",
            subtitle: "Étude empirique (2000–2024) · 3 hypothèses · Données : LSEG Workspace / Refinitiv, WGI, POLCON III, FSI",
            sitLbl: "Situation",
            actLbl: "Méthodologie",
            resLbl: "Résultats clés",
            statHypo: "Hypothèses testées",
            statPeriod: "Période analysée",
            statIndices: "Indices politiques",
            btn: "Lire le rapport complet (PDF)",
          },
          footerBack: "← Portfolio Marketing",
          footerNext: "Portfolio Finance →",
        },
        fin: {
          heroDesc: "Recherche académique en finance quantitative et modélisation empirique — rigueur analytique et insights actionnables pour les décisions d’investissement.",
          heroStatProj: "Projet",
          heroStatData: "Données M&A",
          heroStatHypo: "Hypothèses testées",
          filterAll: "Tous",
          filterAnalyse: "Analyse",
          filterRecherche: "Recherche",
          filterDistinction: "Distinctions",
          ma: {
            num: "01 · Recherche empirique · Finance quantitative",
            subtitle: "Étude empirique (2000–2024) · 3 hypothèses · Données : LSEG Workspace / Refinitiv, WGI, POLCON III, FSI",
            sitLbl: "Situation",
            actLbl: "Méthodologie",
            resLbl: "Résultats clés",
            statHypo: "Hypothèses testées",
            statPeriod: "Période analysée",
            statIndices: "Indices politiques",
            btn: "Lire le rapport complet (PDF)",
          },
          footerBack: "← Portfolio Data & Recherche",
          footerNext: "Accueil →",
        },
      },
      projects: {
        title: "Projets sélectionnés",
        subtitle:
          "Quelques projets académiques ou personnels illustrant ma manière de travailler et mes centres d’intérêt.",
      },
      extracurricular: {
        title: "Expériences Extra-Scolaires",
        subtitle:
          "Engagements dans des clubs et associations qui complètent mon parcours académique.",
        guzheng: {
          title:
            "Directrice marketing & adhésions – Club de guzheng (cithare chinoise)",
          text:
            "Organisation des campagnes de recrutement, gestion des réseaux sociaux, adaptation des cours en fonction des retours et coordination des événements et performances.",
          portfolioLink: "Voir les créations (PDF)",
        },
        camps: {
          title: "Co‑fondatrice – Sora Education (camps de jeunesse)",
          text:
            "Organisation de cinq camps d’été d’une semaine avec deux partenaires, élaboration du business plan, suivi financier et études de marché pour ajuster l’offre de cours et la stratégie marketing.",
          stat1: "Camps organisés",
        },
        clubs: {
          title: "Autres clubs étudiants",
          text:
            "Participation à International College Exchange, Toastmasters, Kyudo, Kendo et Ikebana (art floral).",
        },
        filterAll: "Toutes",
        filterVolunteer: "Bénévolat",
        periodTBD: "Période à préciser",
        filterEntrepreneurship: "Entrepreneuriat",
        filterClubs: "Clubs & culture",
        viewAll: "Voir tout",
        restoCoeur: {
          period: "10/2025 – Présent",
          title: "Bénévole – Restos du Cœur",
          org: "Les Restos du Cœur · Association humanitaire",
          point1: "Distribution alimentaire et accueil de bénéficiaires en situation de précarité.",
          point2: "Tri et conditionnement des denrées alimentaires.",
        },
      },
      volunteer: {
        title: "Bénévolat & Engagement",
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
          stat1: "Volontaires recrutés",
          stat2: "Participants",
          stat3: "Objectif dépassé",
          finTitle: "Membre",
          finOrg: "AIESEC in NCCU (Organisation mondiale à but non lucratif de coordination de programmes de volontariat international)",
          finPoint1: "Gestion du budget et des prévisions financières d’un camp d’été, optimisation des structures de coûts pour dépasser l’objectif de budget équilibré de 53,7%.",
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
          stat1: "Participants",
          stat2: "Langues",
        },
      },
      honors: {
        title: "Distinctions & bourses",
        subtitle:
          "Reconnaissance académique pour mes résultats et mon engagement.",
        exchange: {
          title: "Bourse d’échange",
          org: "Ministère de l’Éducation (Taïwan)",
          text:
            "Bourse au mérite pour un programme d’échange international en France.",
          year: "2024",
        },
        short: {
          title: "Bourse d’études à court terme",
          org: "NCCU – Université Nationale Chengchi",
          text:
            "Financement au mérite pour un séjour d’études à l’étranger.",
          year: "2024",
        },
        excellence: {
          title: "Certificate of Excellence – Top 7% GPA",
          org: "NCCU – Université Nationale Chengchi",
          text:
            "Récompense académique pour des résultats parmi les 7 % meilleurs étudiants de NCCU.",
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
      a11y: { skipLink: "Skip to content" },
      simpleNav: {
        resume: "Resume",
        viewPortfolioPdf: "Portfolio (PDF)",
        langMandarin: "Mandarin",
        langMandarinCert: "Native language",
        langFrench: "French",
        langEnglish: "English",
        langJapanese: "Japanese",
        deepDiveMarketing: "→ Marketing page",
        deepDiveData: "→ Data page",
        deepDiveLabel: "Detailed pages by domain:",
        aiesecDesc: "Led a 4-person marketing team for the international YOLO camp. Created main campaign visuals (posters, posts) for volunteer and participant recruitment.",
        kpnDesc: "On-page & technical SEO optimisation, KPI tracking (traffic, CTR, conversions) via Google Analytics and SEA campaign reporting.",
        footerExtra: "Digital Marketing · Data · Consulting",
      },
      nav: {
        about: "About",
        skills: "Skills",
        education: "Education",
        experience: "Professional Experience",
        portfolio: "Portfolio",
        extracurricular: "Extracurricular Activities",
        volunteer: "Volunteering",
        honors: "Honors",
        projects: "Projects",
        contact: "Contact",
        teaching: {
          languages: "Languages",
          services: "Services",
          expTeaching: "Professional Experience",
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
        availabilityValue: "July 2026 / January 2027 (6-month gap year internship)",
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
        previewTitle: "Skill Detail",
        previewText: "Hover over a skill to see evidence (projects, courses, experience) with context, what was done and the outcomes.",
        chipEnglish: "English – IELTS 8.0 (C1)",
        chipFrench: "French – DALF C1",
        chipJapanese: "Japanese – JLPT N1",
        chipMandarin: "Mandarin – Native Language",
        chipMandarinNative: "Mandarin – Native Language",
        filterData: "Data & Analytics",
        filterMarketing: "Marketing",
        filterConsulting: "Consulting & Strategy",
        filterFinance: "Finance",
        filterSoft: "Soft Skills",
        filterLanguages: "Languages",
        blockData: "Data & Analytics",
        blockMarketing: "Digital Marketing",
        blockConsulting: "Consulting & Strategy",
        blockFinance: "Finance",
        blockSoft: "Soft Skills",
        blockLanguages: "Languages",
        subData1: "Languages & Queries",
        subDataTools: "Tools & Applications",
        subData2: "Dashboards & Visualisation",
        subData3: "Methods & Analysis",
        subDataQuant: "Quantitative Methods",
        subDataQual: "Qualitative Methods & Analysis",
        subData4: "AI & Tools",
        subMkt1: "Acquisition & Performance",
        subMkt2: "Social Media & Content",
        subMkt3: "Strategy & Planning",
        subCons1: "Strategic Analysis",
        subCons2: "Business & Presentations",
        subFin1: "Courses & Fundamentals",
        subFin2: "Analysis & Management Accounting",
        subSoft1: "Collaboration",
        subSoft2: "Leadership & Organisation",
        subSoft3: "Communication",
        chipStatistics: "Statistics & Quantitative Methods",
        chipDesign: "Content Creation & Visual Design",
        chipResearch: "Market Research & Positioning",
        chipCampaign: "Campaign Planning",
        chipIntercultural: "Cross-cultural Collaboration",
        chipLeadership: "Leadership & Team Management",
        chipProject: "Project Management & Organisation",
        chipComm: "Communication & Public Speaking",
        chipAiTools: "AI Tools (ChatGPT, Claude, Gemini)",
        chipAiAds: "AI-Powered Advertising",
        chipAiBusiness: "AI for Business",
        blockAI: "AI Tools",
        blockOffice: "Office Suite",
        blockCreative: "Creative Tools",
        chipChatGPT: "ChatGPT",
        chipClaude: "Claude",
        chipGemini: "Gemini",
        chipVibeCoding: "Vibe Coding",
        chipMicrosoftOffice: "Microsoft Office (Word · Excel · PowerPoint)",
        chipGoogleSuite: "Google Suite",
        chipNotion: "Notion",
        blockDataMarketing: "Data for Marketing",
        subCreativeGraphic: "Graphic Design",
        subCreativeVideo: "Video Editing",
        filterAI: "AI & Digital",
        filterOffice: "Office Suite",
        filterFinance: "Finance",
        filterSoft: "Soft Skills",
        subtitleMarketing: "Digital marketing, content creation, data tools and AI for marketing.",
        subtitleData: "Programming languages, tools, quantitative methods and market research.",
        subtitleFinance: "Analytical tools, financial fundamentals and strategic skills.",
      },
      tags: {
        teaching: "Teaching",
        online: "Online",
        translation: "Translation",
        proofreading: "Proofreading",
        visualDesign: "Visual Design",
        competition: "Competition",
        language: "Language",
        mentoring: "Mentoring",
        immersion: "Immersion",
        intercultural: "Intercultural",
        exchange: "Exchange",
        speaking: "Public Speaking",
        bilingual: "Bilingual",
        volunteer: "Volunteering",
        social: "Social Impact",
        entrepreneurship: "Entrepreneurship",
        strategy: "Strategy",
        leadership: "Leadership",
        marketing: "Marketing",
        clubs: "Clubs",
        culture: "Culture",
        data: "Data",
        research: "Research",
      },
      locations: {
        online: "Online · Taiwan",
      },
      education: {
        title: "Academic Background",
        subtitle:
          "An international path between France and Taiwan, at the crossroads of management, finance and languages.",
        emlyon: {
          period: "09/2023 – Present",
          title: "Master in Management (Grande École Programme)",
          school: "emlyon business school",
          point1: "Specialisation in Finance and Accounting.",
          pointEn: "Fully English-medium programme.",
          gpa: "4.0/4.0",
          specLabel: "Specialisation",
          spec1: "Finance & Accounting",
        },
        nccu: {
          period: "09/2020 – 06/2025",
          title: "Bachelor in French & Diplomacy",
          school: "National Chengchi University (NCCU)",
          majorLabel: "Major",
          minorLabel: "Minor",
          major1: "European Languages and Cultures: French Track",
          major2: "Diplomacy",
          minor1: "Economics",
          point1: "Certificate of Excellence (Top 7% GPA) – 2021, 2023.",
          point2: "Participated in club activities (Public Speaking, Guzheng, Kyudo, Kendo) and held leadership roles in the Guzheng Club and AIESEC.",
          gpa: "4.21 / 4.3 (3.99 / 4.0)",
          statRanking: "Ranking",
          courseManagement: "Management",
          courseDataAnalysis: "Data Analysis & Programming (Excel & Access)",
          coursePython: "Programming 101 (Python)",
          courseResearch: "Research Methods (R)",
          courseMarketing: "Marketing Research (R, Decanter AI)",
          courseFinance: "International Finance",
        },
        paris1: {
          period: "01/2024 – 06/2024",
          title: "Exchange Programme in Political Science",
          school: "Université Paris 1 Panthéon‑Sorbonne",
          point1: "Deepened knowledge of European and international policies.",
          point2: "Academic and cultural immersion in France.",
          course1: "Political Science",
          course2: "International Relations",
          course3: "European Politics",
          typeLabel: "Exchange",
          typeDomain: "Political Science & International Relations",
        },
        coursesLabel: "Relevant courses",
      },
      pageSwitcher: {
        business: "Business",
        teaching: "Teaching",
      },
      chapters: {
        aboutMe: "About Me",
        aboutMeDesc: "My qualifications, experience and background to help you evaluate your teacher.",
        teachingService: "Teaching Service",
        teachingServiceDesc: "What I offer and how to book your first lesson.",
        learningResources: "Learning Resources",
        learningResourcesDesc: "Curated tools, tips and materials to help you practise outside lessons.",
      },
      booking: {
        title: "Book a Lesson",
        subtitle: "Fill in this form to get in touch. I will reply within 24 h to confirm your slot.",
        navCta: "Book a Lesson",
        durationLabel: "Duration",
        durationValue: "Fully customisable — 30 / 45 / 60 / 90 min, whatever works for you",
        materialsLabel: "Teaching Materials",
        materialsValue: "My own self-made materials, or materials you bring — your choice.",
        formatLabel: "Format",
        formatValue: "Online (Zoom / Google Meet)",
        langLabel: "Teaching languages",
        langValue: "English · French · Mandarin",
        responseLabel: "Response time",
        responseValue: "Within 24 h via email or Line",
        fieldName: "Your full name",
        fieldNamePh: "Alice Martin",
        fieldContact: "Preferred contact method",
        contactHint: "Leave your email or Line ID — I'll reply within 24 h.",
        fieldEmail: "Email",
        fieldEmailPh: "alice@example.com",
        fieldLine: "Line ID",
        fieldLinePh: "your_line_id",
        fieldType: "Lesson type",
        optionSelect: "-- Select --",
        optionIelts: "IELTS preparation",
        optionCambridge: "Cambridge / GEPT",
        optionGrades: "School English",
        optionSkill: "Targeted skill",
        optionOther: "Other",
        fieldDuration: "Preferred duration",
        dur30: "30 min",
        dur45: "45 min",
        dur60: "60 min (recommended)",
        dur90: "90 min",
        durCustom: "Other — I'll specify in the message",
        fieldMaterials: "Teaching materials",
        matTeacher: "Self-made materials prepared by the teacher",
        matStudent: "Materials I bring myself",
        matBoth: "A mix of both",
        fieldSlot: "Preferred time slots",
        fieldSlotPh: "e.g. Monday 6–8 pm, Saturday morning",
        fieldMsg: "Message (optional)",
        fieldMsgPh: "Tell me about your level, goals or any questions.",
        submit: "Send request",
        formNote: "This is a front-end demo form. Connect it to Formspree or Netlify Forms to activate it.",
      },
      resources: {
        title: "Learning Resources",
        subtitle: "Free resources to practise English, French or Mandarin between lessons.",
        tabEn: "🇬🇧 English",
        tabFr: "🇫🇷 French",
        tabZh: "🇨🇳 Mandarin",
        websitesTitle: "Websites & Apps",
        tipsTitle: "Study Tips",
        videosTitle: "Video Resources",
        bbc: "Free lessons, videos and quizzes at every level.",
        cambridge: "Official practice materials for Cambridge exams.",
        ieltsOfficial: "Free sample papers and preparation guides from the IELTS organisation.",
        quizlet: "Flashcards and vocabulary games — great for memorising word lists.",
        tip1title: "Listen every day",
        tip1: "Even 10 minutes of English podcasts or YouTube builds your ear for natural speech faster than any textbook.",
        tip2title: "Write, then review",
        tip2: "Write a short paragraph daily on any topic. Bring it to class — we will review it together.",
        tip3title: "Spaced repetition",
        tip3: "Review new vocabulary at increasing intervals (1 day → 3 days → 1 week). Use Quizlet or Anki to automate this.",
        tip4title: "Speak out loud",
        tip4: "Read passages aloud, shadow native speakers or record yourself. Speaking fluency only improves by speaking.",
        bbcYt: "Short, entertaining clips on grammar, vocabulary and pronunciation.",
        duncan: "Long-form live lessons — ideal for intermediate learners who want real conversation.",
        ted: "Advanced listening practice on fascinating topics — use the transcript feature.",
      },
      pageNav: {
        home: "Home",
        overview: "Overview",
        finance: "Finance & Consulting",
        marketing: "Marketing",
        teaching: "Teaching",
        data: "Data & Research",
      },
      financeHero: {
        kicker: "Finance · Accounting ",
        title1: "Bridging analytical rigor with",
        title2: "strategic vision.",
        summary: "Master’s student at emlyon business school with a strong background in Economics and Management, I am dedicated to financial modeling, risk analysis, and complex problem-solving. Rigorous and highly analytical, I leverage tools like Excel and business intelligence to deliver structured insights that support business transformation and value creation.",
        ctaPrimary: "Contact me",
        ctaSecondary: "View my experience",
        cardRole: "Finance & Accounting",
        caseStudyLabel: "Key Experience · Finance & Teaching",
        caseStudyTitle: "Teaching Assistant – Finance & Risk Management",
        caseStudyDesc: "Academic support for finance and risk management courses at the College of Global Banking and Finance (NCCU). Student guidance, course material preparation and coordination across two mandates.",
      },
      marketingHero: {
        kicker: "Digital marketing · Content · Performance",
        title1: "Content that drives",
        title2: "real growth",
        summary: "Master's student at emlyon business school, I led Xiaohongshu campaigns for Engoo (+93% views, +89% interactions in 3 months). I blend creativity, data and brand sense to grow communities and drive performance.",
        ctaPrimary: "View my portfolio",
        ctaSecondary: "Contact me",
        cardRole: "Digital Marketing & Content Creation",
        caseStudyLabel: "Case Study · Engoo XHS",
        caseStudyTitle: "Analytics Dashboard & Xiaohongshu Growth",
        caseStudyS: "Situation: Engoo lacked a centralized tool to track Xiaohongshu performance, making it difficult to quantify engagement and optimize content ROI.",
        caseStudyA: "Action: Developed a dynamic Excel dashboard (Pivot Tables, Nested Formulas) featuring automated A/B period comparison to drive the STP strategy.",
        caseStudyR: "Result: Automated reporting saved 5h/week and led to an 89% interaction increase by identifying winning visual styles.",
        caseStudyInsight1: "• 'Educational Tips' thumbnails deliver a 25% higher CTR than 'Life Hacks' style.",
        caseStudyInsight2: "• The optimal posting 'Golden Time' for the target segment is 7:00 PM – 9:00 PM.",
        caseStudyTemplate: "View Interactive Excel Template",
      },
      dataHero: {
        kicker: "Data analysis · Market research · Quantitative methods",
        title1: "From raw data to",
        title2: "strategic insights.",
        summary: "Master's student at emlyon business school, I turn complex datasets into actionable decisions. Proficient in R, Python, SQL, Excel (TOSA 950/1000), Power BI and Tableau — applied to market research and performance analytics.",
        ctaPrimary: "Download dashboard (Excel)",
        ctaSecondary: "View my experience",
        cardRole: "Data Analysis & Market Research",
        caseStudyLabel: "Case Study · XHS Dashboard",
        caseStudyTitle: "Excel Dashboard – Xiaohongshu Performance",
        caseStudyDesc: "Built a comprehensive Excel dashboard to track 12 daily metrics for Engoo's Xiaohongshu account: KPIs overview, time-series trends and A/B period comparison.",
      },
      teachingHero: {
        kicker: "Languages & international engagement",
        title1: "Language immersion &",
        title2: "intercultural exchange",
        summary: "Native Mandarin speaker, certified DALF C1 (French), IELTS 8.0 (English) and JLPT N1 (Japanese). Engaged in language mentoring and cultural exchange programmes in Taiwan.",
        ctaSecondary: "See my engagement",
        availabilityLabel: "Teaching",
        availabilityValue: "Online · Available",
      },
      teachingLanguages: {
        title: "Language Skills",
        subtitle: "Official certifications and daily use in four languages.",
      },
      teachingServices: {
        title: "Teaching Services",
        subtitle: "Personalised lessons in a relaxed and supportive environment, so every learner can progress at their own pace.",
        philosophy: "In every lesson, I adapt to the student: <strong>games</strong>, <strong>targeted exercises</strong> and <strong>interactive conversation</strong> to make learning natural and lasting.",
        ielts: {
          title: "IELTS Preparation",
          desc: "Full coaching across all 4 modules. Test strategies, intensive practice and mock exams, with personalised progress tracking.",
          tag1: "Reading & Writing",
          tag2: "Speaking & Listening",
          tag3: "Exam Strategies",
          tag4: "Target Band 6.0 – 8.0+",
        },
        grades: {
          title: "English For All Levels",
          desc: "Lessons aligned with the Taiwanese school curriculum from primary to high school. Grammar, vocabulary, comprehension and expression.",
          tag1: "Primary School",
          tag2: "Middle School",
          tag3: "High School",
          tag4: "School Support",
        },
        exams: {
          title: "Cambridge English & GEPT",
          desc: "Structured preparation for official Cambridge and GEPT exams. Past paper practice and techniques tailored to each test component.",
          tag1: "YLE (Children)",
          tag2: "A2 Key / B1 Preliminary",
          tag3: "B2 First",
          tag4: "GEPT 全民英檢",
        },
        skills: {
          title: "Targeted Skill Reinforcement",
          desc: "Focused work on a specific skill: writing, reading, speaking, grammar, or essay preparation for school exams.",
          tag1: "Writing",
          tag2: "Reading",
          tag3: "Speaking",
          tag4: "Grammar & Vocabulary",
        },
      },
      teachingExp: {
        title: "Teaching Experience",
        subtitle: "Online tutoring, exam preparation and translation & proofreading services.",
        translation: {
          period: "2022 – 2024",
          title: "Translator & Proofreader (Freelance)",
          company: "Freelance · Academic & Editorial Projects",
          point1: "Translation of academic documents and professional content between Chinese, English and French.",
          point2: "Proofreading and editing of theses, articles and communication materials for students and businesses.",
        },
      },
      teachingEngagement: {
        title: "Language & International Engagement",
        subtitle: "Language mentoring, cultural immersion and international exchange programmes.",
      },
            experience: {
        title: "Professional Experience",
        subtitle:
          "A selection of my experience in digital marketing, data analysis and project coordination.",
        kpn: {
          period: "01/2025 – 06/2025",
          title: "Digital Marketing Assistant",
          point1: "SEO optimisation (on-page & technical) and content recommendations.",
          point2: "KPI tracking and performance analysis (traffic, CTR, conversions).",
          point3: "SEA campaign management and reporting.",
          dataPoint1: "Led a quantitative research project to identify digital performance drivers, synthesising data into strategic recommendations for the team.",
          dataPoint2: "Designed and managed marketing performance dashboards (FB & Google) — +9.5% CTR, +5.1% CVR.",
          dataPoint3: "Conducted in-depth competitive benchmarking and tracked KPIs (traffic, CTR, conversions) via Google Analytics & Search Console.",
          finTitle: "Digital Marketing Assistant (Internship)",
          finCompany: "KPN (Company Providing Digital Marketing Services, such as SEO, SEM, FB ads)",
          finPoint1: "Managed monthly advertising budgets for Facebook and Google Ads accounts, tracking ROI metrics and allocating capital efficiently to optimize cost-per-acquisition (conversion rate +5.1%).",
          finPoint2: "Formulated and executed monthly performance audits on websites, analyzed key divergence data, and collaborated with cross-functional teams to mitigate problems.",
        },
        engoo: {
          period: "10/2024 – 02/2025",
          title: "Marketing Assistant",
          point1: "Xiaohongshu content strategy using STP model and A/B testing – +89.1% interactions and +69.7% followers in 3 months.",
          point2: "Competitive monitoring, audience analysis and visual adaptation by target sub-segment.",
          point3: "Created Meta content (Facebook & Instagram) aligned with trends and brand identity.",
          dataPoint1: "Built a dynamic Excel dashboard — 12 daily metrics, automated A/B comparison and KPI visualisation — cutting reporting time by 5h/week.",
          dataPoint2: "Conducted in-depth market analyses and competitive monitoring to optimise the content strategy for the simplified Chinese market (REDnote / Xiaohongshu).",
          dataPoint3: "Deployed a data-driven content strategy based on the STP model — +93.3% views, +89.1% interactions and +69.7% followers in 3 months.",
          finTitle: "Marketing Assistant (Internship)",
          finCompany: "Engoo, DMM.com (International Online Language Tutoring Platform)",
          finPoint1: "Performed market analysis to develop and refine marketing strategies for the Simplified Chinese market.",
          finPoint2: "Managed channel performance and content metrics for Xiaohongshu, boosting views by 93.3%, engagement by 89.1% and followers by 69.7% within 3 months.",
          pythonPoint: "Developed a Python script to automate the daily data consolidation process, improving the efficiency of reporting operations every day.",
          portfolioLink: "View creations (PDF)",
          excelLink: "Download XHS Dashboard (Excel)",
          excelHref: "assets/Engoo_XHS Dashboard_EN.xlsx",
          stat1: "Views",
          stat2: "Followers",
          stat3: "Interactions",
          screenshot1: "assets/Engoo Dashboard_EN.png",
          screenshot2: "assets/Engoo Data_EN.png",
          screenshotAlt1: "Performance Dashboard – Engoo XHS",
          screenshotAlt2: "Raw Data – Engoo XHS",
          showcaseLabel: "Work output · XHS Dashboard",
          showcaseBadge1: "📊 General Performance",
          showcaseTitle1: "Overview · Last 30 Days",
          showcaseDesc1: "Left panel: core KPIs (views, followers, engagement, brand awareness) and trend charts for the selected period.",
          showcaseBadge2: "⚖️ A/B Comparison",
          showcaseTitle2: "Last 30 Days vs Previous 30",
          showcaseDesc2: "Right panel: Period A vs Period B trend curve to identify growth patterns and the impact of content actions.",
          showcaseBadge3: "📋 Raw Data",
          showcaseTitle3: "Daily Dataset",
          showcaseDesc3: "12 metrics per day (views, watch time, engagement, brand awareness…) — the structured foundation of all visualisations.",
        },
        teaching: {
          period: "07/2023 – 12/2023 · 07/2024 – 04/2025",
          title: "Teaching Assistant",
          point1: "Course support (finance, risk management) and student follow-up.",
          point2: "Prepared course materials and handled logistics.",
          dataSupport: "Pedagogical support for programming and data analysis courses (VBA, Access).",
          dataCoord: "Coordinated the operational logistics of 9 courses and served as the interface between demanding stakeholders.",
          finTitle: "Course Assistant",
          finCompany: "College of Global Banking and Finance, NCCU",
          finPoint1: "Coordinated logistics for 9 finance courses, serving as the liaison between students, faculty and corporate partners.",
          finPoint2: "Facilitated networking events and project briefings, ensuring strict compliance with university regulations and managing multi-stakeholder scheduling under tight timelines.",
        },
        tutorABC: {
          period: "08/2024 – Present",
          title: "Online English Tutor",
          point1: "One-on-one and group lessons online English tutoring for learners from primary to high school level.",
          point2: "Pronunciation, speaking, beginner and Cambridge English exam preparation.",
          coursesLabel: "Courses taught",
          courseGradeSchool: "English (primary)",
          courseMiddle: "English (secondary)",
          courseHigh: "English (high school)",
          stat1: "Days",
          stat2: "Students",
          stat3: "Sessions",
          stat4: "Followers",
          stat5: "TTT",
        },
        research: {
          period: "06/2023 – 12/2023",
          title: "Research Assistant",
          point1: "Data collection, cleaning and analysis for research papers.",
          point2: "Produced summaries and seminar materials.",
          dataPoint1: "Analysed macroeconomic issues using a dual quantitative and qualitative approach via R and Excel, ensuring the rigour of deliverables.",
          dataPoint2: "Data collection, cleaning and processing; produced quantitative summaries and materials for seminars and conferences.",
          finCompany: "Institute of International Relations, NCCU",
          finPoint1: "Analyzed economic trends and datasets using qualitative surveys and quantitative regression methods.",
        },
        filterAll: "All",
        filterTeaching: "Teaching",
        filterFinance: "Finance",
        filterMarketing: "Marketing",
        viewAll: "View all",
        subtitleFinance: "Finance, data analysis and strategic consulting.",
        subtitleMarketing: "Social media, performance marketing, content creation and community engagement.",
        subtitleData: "Data analysis, dashboards and market research.",
      },
      portfolio: {
        title: "Portfolio – Social Media & Design",
        subtitle: "Concrete examples of content created, campaigns managed and visual work produced.",
        viewPdf: "View full portfolio (PDF)",
        engooCard: { dashboardDesc: "12 metrics / day · Time series · A/B period comparison." },
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
          title: "Personal Book Review Account",
          desc: "Created visual and written content for a personal Instagram account dedicated to book reviews. Original visual storytelling and accessible literary analysis – e.g. Flowers for Algernon.",
        },
        design: {
          tag: "Photography & Design",
          title: "Photography & Promotional Materials",
          desc: "Photography of landscapes, portraits and architecture – exploring unexpected angles. Designed communication materials for events: name badges, posters and posts for the kyudo club and other activities.",
        },
        packaging: {
          title: "Packaging Design Competition – 18th Penwards",
          desc: "Entry for the 18th Penwards packaging design competition (2024). Created promotional visuals for the open call.",
        },
        insightLbl: "Key Insights",
        mkt: {
          heroEyebrow: "Yu-Ting Tseng · Selected Projects · 2024–2025",
          heroDesc: "Data-driven campaigns, art direction and community management — projects where visual creativity meets performance analytics.",
          heroStatProjets: "Projects",
          heroStatGrowth: "XHS Growth",
          heroStatPart: "AIESEC Participants",
          filterAll: "All",
          filterDashboard: "Dashboard & Data",
          filterCampagne: "Campaigns",
          filterDesign: "Visual Design",
          filterCommunity: "Community",
          engoo: {
            num: "01 · Full Case Study",
            tag: "Excel Dashboard · Social Analytics · A/B Testing",
            sitLbl: "Situation · Context & Challenge",
            actLbl: "Action · Dashboard Architecture",
            resLbl: "Results · 3-Month Impact",
            statMet: "Metrics / day",
            statVues: "Views · 3 months",
            statInter: "Interactions",
            statAb: "Dynamic A/B Module",
          },
          aiesec: {
            num: "02 · Marketing Campaign",
            tag: "Campaign · Art Direction",
            body: "Led the 4-person marketing team for AIESEC in NCCU's YOLO international camp. Designed the main campaign visuals — posters and social posts — to drive volunteer and participant recruitment.",
            statVol: "Volunteers recruited",
            statPart: "Participants",
            statBudget: "Budget target exceeded",
          },
          guzhengNum: "03 · Community Management",
          penwardsNum: "04 · Visual Design",
          penwardsTag: "Design · Competition",
          footerBack: "← Back to Marketing",
          footerNext: "Data & Research Portfolio →",
        },
        data: {
          heroDesc: "Excel dashboards, quantitative analyses and market research — analytical rigour in service of actionable business decisions.",
          heroStatProjets: "Projects",
          heroStatGrowth: "XHS Growth",
          heroStatHypo: "M&A Hypotheses",
          filterAll: "All",
          filterDashboard: "Dashboard",
          filterAnalyse: "Analysis",
          filterRecherche: "Research",
          filterReporting: "Reporting",
          dashboard: {
            num: "01 · Dashboard · Case Study",
            sitLbl: "Situation · Analytical Challenge",
            actLbl: "Action · Dashboard Architecture",
            resLbl: "Results · Measured 3-Month Impact",
            statMet: "Metrics / day",
            statVues: "Views · 3 months",
            statAb: "Dynamic A/B Comparison",
          },
          ma: {
            num: "02 · Empirical Research · Quantitative Finance",
            subtitle: "Empirical study (2000–2024) · 3 hypotheses · Data: LSEG Workspace / Refinitiv, WGI, POLCON III, FSI",
            sitLbl: "Situation",
            actLbl: "Methodology",
            resLbl: "Key Findings",
            statHypo: "Hypotheses tested",
            statPeriod: "Period analysed",
            statIndices: "Political indices",
            btn: "Read the full paper (PDF)",
          },
          footerBack: "← Marketing Portfolio",
          footerNext: "Finance Portfolio →",
        },
        fin: {
          heroDesc: "Academic research in quantitative finance and empirical modelling — rigorous analysis producing actionable investment insights.",
          heroStatProj: "Project",
          heroStatData: "M&A Data",
          heroStatHypo: "Hypotheses tested",
          filterAll: "All",
          filterAnalyse: "Analysis",
          filterRecherche: "Research",
          filterDistinction: "Awards",
          ma: {
            num: "01 · Empirical Research · Quantitative Finance",
            subtitle: "Empirical study (2000–2024) · 3 hypotheses · Data: LSEG Workspace / Refinitiv, WGI, POLCON III, FSI",
            sitLbl: "Situation",
            actLbl: "Methodology",
            resLbl: "Key Findings",
            statHypo: "Hypotheses tested",
            statPeriod: "Period analysed",
            statIndices: "Political indices",
            btn: "Read the full paper (PDF)",
          },
          footerBack: "← Data & Research Portfolio",
          footerNext: "Home →",
        },
      },
      projects: {
        title: "Selected Projects",
        subtitle:
          "A few academic and personal projects that reflect how I work and what I care about.",
      },
      extracurricular: {
        title: "Extracurricular Activities",
        subtitle:
          "Clubs and initiatives that complement my academic path.",
        guzheng: {
          title:
            "Marketing & Membership Director – Guzheng (Chinese Zither) Club",
          text:
            "Led recruitment campaigns, managed social media, adjusted course structure based on feedback and coordinated events and performances.",
          portfolioLink: "View creations (PDF)",
        },
        camps: {
          title: "Co‑Founder – Sora Education (Youth Camps)",
          text:
            "Co‑ran five week‑long summer camps with two partners, built the business plan, managed finances and conducted market research to refine course design and marketing strategy.",
          stat1: "Camps organised",
        },
        clubs: {
          title: "Other Student Clubs",
          text:
            "Member of International College Exchange, Toastmasters, Kyudo, Kendo and Flower Arrangement club.",
        },
        filterAll: "All",
        filterVolunteer: "Volunteering",
        periodTBD: "Dates TBC",
        filterEntrepreneurship: "Entrepreneurship",
        filterClubs: "Clubs & culture",
        viewAll: "View all",
        restoCoeur: {
          period: "10/2025 – Present",
          title: "Volunteer – Restos du Cœur",
          org: "Les Restos du Cœur · Humanitarian association",
          point1: "Food distribution and support for people in precarious situations.",
          point2: "Sorting and packaging of food donations.",
        },
      },
      volunteer: {
        title: "Volunteer & Leadership Experience",
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
          stat1: "Volunteers recruited",
          stat2: "Participants",
          stat3: "Above target",
          finTitle: "Member",
          finOrg: "AIESEC in NCCU (Global non-profit coordinating international volunteer programs)",
          finPoint1: "Managed the project budget and financial forecast for a summer camp, optimizing cost structures to exceed the balanced budget target by 53.7%.",
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
          stat1: "Participants",
          stat2: "Languages",
        },
      },
      honors: {
        title: "Honors & Awards",
        subtitle: "Academic recognition for performance and engagement.",
        exchange: {
          title: "Exchange Student Scholarship",
          org: "Ministry of Education, Taiwan",
          text: "Merit scholarship for international exchange studies in France.",
          year: "2024",
        },
        short: {
          title: "Short‑term Study Abroad Scholarship",
          org: "NCCU – National Chengchi University",
          text: "Funding for short‑term study abroad based on academic excellence.",
          year: "2024",
        },
        excellence: {
          title: "Certificate of Excellence – Top 7% GPA",
          org: "NCCU – National Chengchi University",
          text: "Awarded for maintaining a GPA within the top 7% of the cohort.",
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
      a11y: { skipLink: "跳至內容" },
      simpleNav: {
        resume: "履歷",
        viewPortfolioPdf: "作品集（PDF）",
        langMandarin: "中文（普通話）",
        langMandarinCert: "母語",
        langFrench: "法語",
        langEnglish: "英語",
        langJapanese: "日語",
        deepDiveMarketing: "→ 行銷專頁",
        deepDiveData: "→ 數據專頁",
        deepDiveLabel: "各領域詳細頁面：",
        aiesecDesc: "帶領四人行銷小組，負責 AIESEC YOLO 國際志工營的招募宣傳，製作主視覺與活動海報，超額完成招募目標。",
        kpnDesc: "執行 SEO 優化、透過 Google Analytics 追蹤 KPI（流量、CTR、轉換率），並進行 SEA 廣告成效報告。",
        footerExtra: "數位行銷 · 數據分析 · 顧問",
      },
      nav: {
        about: "關於我",
        skills: "技能專長",
        education: "學歷背景",
        experience: "實習與工作",
        portfolio: "作品集",
        extracurricular: "課外活動與志工",
        volunteer: "志工與領導",
        honors: "獎學金與榮譽",
        projects: "專案作品",
        contact: "聯絡方式",
        teaching: {
          languages: "語言能力",
          services: "教學服務",
          expTeaching: "教學經歷",
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
        chipEnglish: "英語 – IELTS 8.0 (C1)",
        chipFrench: "法語 – DALF C1",
        chipJapanese: "日本語 – JLPT N1",
        chipMandarin: "中文",
        chipMandarinNative: "中文 – 母語",
        filterData: "數據分析",
        filterMarketing: "行銷",
        filterConsulting: "顧問策略",
        filterFinance: "財務金融",
        filterSoft: "軟實力",
        filterLanguages: "語言",
        blockData: "數據分析",
        blockMarketing: "數位行銷",
        blockConsulting: "顧問策略",
        blockFinance: "財務金融",
        blockSoft: "軟實力",
        blockLanguages: "語言",
        subData1: "程式語言",
        subDataTools: "工具與應用程式",
        subData2: "數據視覺化",
        subData3: "分析方法",
        subDataQuant: "量化方法",
        subDataQual: "質化方法與分析",
        subData4: "AI 工具",
        subMkt1: "廣告投放",
        subMkt2: "社群媒體與內容",
        subMkt3: "策略規劃",
        subCons1: "策略分析",
        subCons2: "商業提案",
        subFin1: "課程與基礎",
        subSoft1: "跨文化合作",
        subSoft2: "領導與組織",
        subSoft3: "溝通",
        chipStatistics: "統計與量化方法",
        chipDesign: "內容創作與視覺設計",
        chipResearch: "市場調研與定位",
        chipCampaign: "行銷活動規劃",
        chipIntercultural: "跨文化協作",
        chipLeadership: "領導與團隊管理",
        chipProject: "專案管理與組織",
        chipComm: "溝通與公眾演講",
        chipAiTools: "AI 工具（ChatGPT、Claude、Gemini）",
        chipAiAds: "AI 輔助廣告",
        chipAiBusiness: "AI 商業應用",
        subFin2: "分析與管理會計",
        blockAI: "AI 工具",
        blockOffice: "辦公軟體",
        blockCreative: "創意工具",
        chipChatGPT: "ChatGPT",
        chipClaude: "Claude",
        chipGemini: "Gemini",
        chipVibeCoding: "Vibe Coding",
        chipMicrosoftOffice: "Microsoft Office（Word · Excel · PowerPoint）",
        chipGoogleSuite: "Google Suite",
        chipNotion: "Notion",
        subCreativeGraphic: "平面設計",
        subCreativeVideo: "影片剪輯",
        filterAI: "AI 與數位",
        filterOffice: "辦公軟體",
        blockDataMarketing: "行銷數據",
        subtitleMarketing: "數位行銷、內容創作、數據工具與 AI 行銷應用。",
        subtitleData: "程式語言、工具、量化方法與市場研究。",
        subtitleFinance: "分析工具、財務基礎與策略技能。",
      },
      tags: {
        visualDesign: "視覺設計",
        competition: "競賽",
        teaching: "教學",
        online: "線上",
        translation: "翻譯",
        proofreading: "校稿",
        language: "語言",
        mentoring: "導師",
        immersion: "語言沉浸",
        intercultural: "跨文化",
        exchange: "交流",
        speaking: "公眾演講",
        bilingual: "雙語",
        volunteer: "志工",
        social: "社會影響",
        entrepreneurship: "創業",
        strategy: "策略",
        leadership: "領導力",
        marketing: "行銷",
        clubs: "社團",
        culture: "文化",
        data: "數據",
        research: "研究",
      },
      locations: {
        online: "線上 · 台灣",
      },
      education: {
        title: "學歷背景",
        subtitle: "在法國與台灣之間，結合管理、金融與語言的國際化養成。",
        emlyon: {
          period: "2023/09 – 至今",
          title: "管理學碩士（Grande École 計畫）",
          school: "emlyon business school",
          point1: "主修金融與會計。",
          pointEn: "全英語授課課程。",
          gpa: "4.0/4.0",
          specLabel: "專業方向",
          spec1: "財務與會計",
        },
        nccu: {
          period: "2020/09 – 2025/06",
          title: "歐洲語文學系法文組、外交學系雙主修；經濟系輔系",
          school: "國立政治大學（NCCU）",
          majorLabel: "主修",
          minorLabel: "輔系",
          major1: "歐洲語文學系法文組",
          major2: "外交學",
          minor1: "經濟",
          point1: "榮獲卓越獎（前 5% GPA）— 2021、2023 年。",
          point2: "擔任 AIESEC NCCU 地方委員會副主席。",
          gpa: "4.22 / 4.3",
          statRanking: "排名",
          courseManagement: "管理學",
          courseDataAnalysis: "資料分析與程式設計（VBA & Access）",
          coursePython: "程式設計概論（Python）",
          courseResearch: "研究方法（R 與統計）",
          courseMarketing: "行銷研究（R, Decanter AI）",
          courseFinance: "國際金融",
        },
        paris1: {
          period: "2024/01 – 2024/06",
          title: "政治學交換學生",
          school: "巴黎第一大學（Paris 1 Panthéon‑Sorbonne）",
          point1: "深化對歐洲及國際政治的理解。",
          point2: "在法國進行學術與文化沉浸。",
          course1: "政治學",
          course2: "國際關係",
          course3: "歐洲政策",
          typeLabel: "交換",
          typeDomain: "政治學與國際關係",
        },
        coursesLabel: "修習課程",
      },
      pageSwitcher: {
        business: "商務",
        teaching: "教學",
      },
      chapters: {
        aboutMe: "關於我",
        aboutMeDesc: "我的語言資歷、教學經驗與學歷背景，協助您評估這位老師是否適合您。",
        teachingService: "教學服務",
        teachingServiceDesc: "我提供的課程內容，以及如何預約第一堂課。",
        learningResources: "學習資源",
        learningResourcesDesc: "精選工具、學習技巧與素材，幫助您在課堂之外持續進步。",
      },
      booking: {
        title: "預約課程",
        subtitle: "填寫此表單與我聯繫，我將在24小時內回覆以確認您的課程時段。",
        navCta: "預約課程",
        durationLabel: "課程時長",
        durationValue: "可客製化 — 30 / 45 / 60 / 90 分鐘，依您需求調整",
        materialsLabel: "教學教材",
        materialsValue: "使用自製教學教材，或依學生指定的學習材料上課——由您決定。",
        formatLabel: "上課形式",
        formatValue: "線上（Zoom / Google Meet）",
        langLabel: "授課語言",
        langValue: "英語 · 法語 · 中文",
        responseLabel: "回覆時間",
        responseValue: "24小時內以Email或Line回覆",
        fieldName: "您的姓名",
        fieldNamePh: "王小明",
        fieldContact: "偏好聯絡方式",
        contactHint: "請留下您的Email或Line ID，我將在24小時內與您聯繫。",
        fieldEmail: "Email",
        fieldEmailPh: "example@mail.com",
        fieldLine: "Line ID",
        fieldLinePh: "您的Line ID",
        fieldType: "課程類型",
        optionSelect: "-- 請選擇 --",
        optionIelts: "IELTS 備考",
        optionCambridge: "Cambridge / 全民英檢",
        optionGrades: "學校英文",
        optionSkill: "特定技能加強",
        optionOther: "其他",
        fieldDuration: "偏好課程時長",
        dur30: "30 分鐘",
        dur45: "45 分鐘",
        dur60: "60 分鐘（推薦）",
        dur90: "90 分鐘",
        durCustom: "其他時長 — 我在留言中說明",
        fieldMaterials: "教材偏好",
        matTeacher: "使用老師自製教材",
        matStudent: "學生自備指定教材",
        matBoth: "兩者皆可",
        fieldSlot: "偏好時段",
        fieldSlotPh: "例：週一 18:00–20:00、週六早上",
        fieldMsg: "留言（選填）",
        fieldMsgPh: "告訴我您目前的程度、學習目標或任何問題。",
        submit: "送出預約申請",
        formNote: "此表單為前端示範，可接入 Formspree 或 Netlify Forms 等服務。",
      },
      resources: {
        title: "學習資源",
        subtitle: "免費資源，幫助您在課堂之外練習英語、法語或中文。",
        tabEn: "🇬🇧 英語",
        tabFr: "🇫🇷 法語",
        tabZh: "🇨🇳 中文",
        websitesTitle: "網站與應用程式",
        tipsTitle: "學習技巧",
        videosTitle: "影片資源",
        bbc: "免費課程、影片與測驗，適合各程度學習者。",
        cambridge: "劍橋英語考試官方備考資料。",
        ieltsOfficial: "IELTS 官方免費模擬試卷與備考指南。",
        quizlet: "單字卡與詞彙遊戲，是記憶單字表的好幫手。",
        tip1title: "每天聆聽英語",
        tip1: "每天只需 10 分鐘的英語 Podcast 或 YouTube，培養語感的速度遠超過任何課本。",
        tip2title: "寫作後再複習",
        tip2: "每天用英文寫一小段話，任何主題皆可。帶到課堂來，我們一起修改。",
        tip3title: "間隔重複法",
        tip3: "以遞增間隔複習新單字（1天→3天→1週）。可用 Quizlet 或 Anki 自動化這個流程。",
        tip4title: "大聲說英語",
        tip4: "朗讀文章、模仿母語者說話，或錄下自己的聲音。口說流暢度只有透過開口練習才會進步。",
        bbcYt: "短片教學，涵蓋文法、詞彙與發音。",
        duncan: "長格式直播課程，適合想練習真實對話的中級學習者。",
        ted: "以精彩主題進行進階聽力練習，善用逐字稿功能。",
      },
      pageNav: {
        home: "首頁",
        overview: "總覽",
        finance: "財務與顧問",
        marketing: "行銷",
        teaching: "教學",
        data: "數據與研究",
      },
      financeHero: {
        kicker: "數據分析 · 策略顧問 · 財務",
        title1: "從數據到",
        title2: "策略決策",
        summary: "就讀 emlyon business school 碩士班（財務與會計專項），結合嚴謹的分析能力、數據工具應用與商業敏銳度，為財務與顧問領域創造價值。",
        ctaPrimary: "聯繫我",
        ctaSecondary: "查看我的經歷",
        cardRole: "財務 & 策略顧問",
        caseStudyLabel: "核心經歷 · 財務與教學",
        caseStudyTitle: "助教 – 財務與風險管理",
        caseStudyDesc: "擔任政大國際金融學院財務與風險管理課程助教，協助備課、學生輔導與課務協調，歷經兩個學期任期。",
      },
      marketingHero: {
        kicker: "數位行銷 · 內容創作 · 績效行銷",
        title1: "創造真實成長的",
        title2: "內容策略",
        summary: "就讀 emlyon business school 碩士班，曾主導 Engoo 小紅書帳號的內容策略（3個月內瀏覽量+93%、互動量+89%）。結合創意、數據與品牌感知，助力社群增長與業績提升。",
        ctaPrimary: "查看作品集",
        ctaSecondary: "聯繫我",
        cardRole: "數位行銷 & 內容創作",
        caseStudyLabel: "案例研究 · Engoo 小紅書",
        caseStudyTitle: "小紅書社群成效動態儀表板 | Excel Analytics",
        caseStudyS: "背景 (Situation)：品牌在小紅書的數據分散，難以量化互動成效、計算真實的粉絲轉化率與內容投資報酬率。",
        caseStudyA: "行動 (Action)：清洗原始數據，利用樞紐分析與進階公式構建動態儀表板，實現「當月 vs 上月」的自動化指標對比。",
        caseStudyR: "成果 (Result)：報表自動化節省了每週 5 小時的人力，並透過數據找出互動率最高的視覺風格，使互動量提升 89%。",
        caseStudyInsight1: "• 「教學類」主視覺的點擊率 (CTR) 比「生活感」風格高出 25%。",
        caseStudyInsight2: "• 目標客群的黃金互動時段集中在晚間 7 點至 9 點。",
        caseStudyTemplate: "查看互動式 Excel 範本",
      },
      dataHero: {
        kicker: "數據分析 · 市場研究 · 量化方法",
        title1: "從原始數據到",
        title2: "策略洞察",
        summary: "就讀 emlyon business school 碩士班，擅長將複雜數據集轉化為可執行的決策建議。熟練使用 R、Python、SQL、Excel（TOSA 950/1000）、Power BI 與 Tableau，應用於市場研究與績效分析。",
        ctaPrimary: "下載儀表板（Excel）",
        ctaSecondary: "查看我的經歷",
        cardRole: "數據分析 & 市場研究",
        caseStudyLabel: "案例研究 · 小紅書儀表板",
        caseStudyTitle: "Excel 儀表板 – 小紅書績效追蹤",
        caseStudyDesc: "為 Engoo 小紅書帳號建立完整的 Excel 儀表板，追蹤 12 項每日指標：KPI 概覽、時間序列趨勢與 A/B 週期比較。",
      },
      teachingHero: {
        kicker: "語言 · 教學 · 國際交流",
        title1: "跨語言連結，",
        title2: "促進文化交流",
        summary: "中文母語使用者，持有 DALF C1（法語）、IELTS 8.0（英語）、JLPT N1（日語）認證。深度參與語言夥伴計畫與跨文化交流活動。",
        ctaSecondary: "查看我的參與紀錄",
        availabilityLabel: "線上教學",
        availabilityValue: "線上 · 開課中",
      },
      teachingLanguages: {
        title: "語言能力",
        subtitle: "四語認證與日常應用。",
      },
      teachingServices: {
        title: "教學服務",
        subtitle: "量身打造的課程，在輕鬆友善的環境中，讓每位學生以自己的步調穩定進步。",
        philosophy: "每堂課我都會根據學生需求調整方式：<strong>遊戲</strong>、<strong>針對性練習</strong>與<strong>互動對話</strong>，讓學習自然又有效。",
        ielts: {
          title: "IELTS 備考",
          desc: "四大項目全面訓練：閱讀、寫作、口說、聽力。搭配考試策略、模擬測驗與個人化進度追蹤。",
          tag1: "閱讀與寫作",
          tag2: "口說與聽力",
          tag3: "考試策略",
          tag4: "目標 Band 6.0 – 8.0+",
        },
        grades: {
          title: "各年段英語課程",
          desc: "依照台灣學校課綱，提供國小至高中各年段英語課程。涵蓋文法、字彙、閱讀理解與英語表達。",
          tag1: "國小",
          tag2: "國中",
          tag3: "高中",
          tag4: "課業輔導",
        },
        exams: {
          title: "全民英檢 & 劍橋英語認證",
          desc: "針對全民英檢（GEPT）與劍橋英語系列考試的系統備考，搭配歷屆試題演練與各項目解題技巧。",
          tag1: "YLE（兒童英檢）",
          tag2: "A2 Key / B1 Preliminary",
          tag3: "B2 First",
          tag4: "全民英檢 GEPT",
        },
        skills: {
          title: "單項能力加強",
          desc: "針對單一技能深度訓練：寫作、閱讀、口說、文法，或學校作文與英語小考的衝刺準備。",
          tag1: "寫作",
          tag2: "閱讀",
          tag3: "口說",
          tag4: "文法與字彙",
        },
      },
      teachingExp: {
        title: "教學經歷",
        subtitle: "線上英語家教、考試備考輔導，以及翻譯與校對服務。",
        translation: {
          period: "2022 – 2024",
          title: "翻譯與校對（自由接案）",
          company: "自由接案 · 學術與編輯專案",
          point1: "中英法三語學術文件與專業內容翻譯。",
          point2: "學術論文、文章與宣傳資料的校對與潤稿服務。",
        },
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
          dataPoint1: "主導量化研究專案，識別數位績效關鍵驅動因素，並將數據轉化為策略建議提供給團隊。",
          dataPoint2: "設計並管理行銷效能儀表板（FB & Google）——CTR 提升 +9.5%、CVR 提升 +5.1%。",
          dataPoint3: "執行深入競品基準分析，並透過 Google Analytics & Search Console 追蹤 KPI（流量、CTR、轉換率）。",
          finTitle: "數位行銷實習生（實習）",
          finCompany: "KPN（提供 SEO、SEM、FB 廣告等數位行銷服務的公司）",
          finPoint1: "管理 Facebook 與 Google Ads 每月廣告預算，追蹤 ROI 指標並有效分配資本以優化每次獲客成本（轉換率 +5.1%）。",
          finPoint2: "執行每月網站成效稽核，分析關鍵差異數據，並與跨功能團隊協作排除問題。",
        },
        engoo: {
          period: "2024/10 – 2025/02",
          title: "行銷實習生",
          point1: "以 STP 模型規劃小紅書內容策略，搭配 A/B 測試優化文案與設計，3 個月內互動量提升 89.1%、粉絲數增加 69.7%。",
          point2: "競品監測、受眾分析，針對不同子客群調整視覺素材。",
          point3: "製作 Meta 平台（Facebook & Instagram）內容，融合品牌調性與趨勢熱點。",
          dataPoint1: "建立動態 Excel 儀表板——12 項每日指標、自動化 A/B 比較與 KPI 視覺化——每週節省 5 小時報表時間。",
          dataPoint2: "執行深入市場分析與競品監測，優化針對簡體中文市場（REDnote / 小紅書）的內容策略。",
          dataPoint3: "部署以 STP 模型為基礎的數據驅動內容策略——3 個月內瀏覽量 +93.3%、互動量 +89.1%、粉絲數 +69.7%。",
          pythonPoint: "開發 Python 自動化腳本，整合每日數據，提升每日報表效率。",
          finTitle: "行銷實習生（實習）",
          finCompany: "Engoo, DMM.com（國際線上語言學習平台）",
          finPoint1: "執行市場分析，為簡體中文市場制定並精煉行銷策略。",
          finPoint2: "管理小紅書頻道績效與內容指標——3 個月內瀏覽量 +93.3%、互動量 +89.1%、粉絲數 +69.7%。",
          portfolioLink: "查看作品集 (PDF)",
          excelLink: "下載小紅書數據儀表板（Excel）",
          excelHref: "assets/Engoo_XHS Dashboard_EN.xlsx",
          stat1: "瀏覽量",
          stat2: "粉絲數",
          stat3: "互動量",
          screenshot1: "assets/Engoo Dashboard_EN.png",
          screenshot2: "assets/Engoo Data_EN.png",
          screenshotAlt1: "Performance Dashboard – Engoo XHS",
          screenshotAlt2: "Raw Data – Engoo XHS",
          showcaseLabel: "作品展示 · 小紅書數據儀表板",
          showcaseBadge1: "📊 整體績效",
          showcaseTitle1: "概覽 · 最近 30 天",
          showcaseDesc1: "左側區塊：核心 KPI（瀏覽量、粉絲、互動率、品牌知名度）及所選期間的趨勢圖表。",
          showcaseBadge2: "⚖️ A/B 比較",
          showcaseTitle2: "最近 30 天 vs 前 30 天",
          showcaseDesc2: "右側區塊：A/B 期間趨勢曲線，用於識別增長規律及內容策略的實際影響。",
          showcaseBadge3: "📋 原始數據",
          showcaseTitle3: "每日數據集",
          showcaseDesc3: "每天 12 項指標（瀏覽量、觀看時長、互動率、品牌知名度…）——所有視覺化的結構化數據基礎。",
        },
        teaching: {
          period: "2023/07 – 2023/12；2024/07 – 2025/04",
          title: "課程助教",
          point1: "協助金融與風險管理課程教學及學生輔導。",
          point2: "製作教材並負責行政協調。",
          dataSupport: "協助程式設計與資料分析課程（VBA、Access）的教學支援。",
          dataCoord: "協調 9 門課程的行政後勤，並擔任各方利害關係人之間的溝通橋樑。",
          finTitle: "課程助教",
          finCompany: "國立政治大學國際金融學院",
          finPoint1: "協調 9 門財金課程的後勤行政，擔任學生、師長與企業合作夥伴之間的橋樑。",
          finPoint2: "主持交流活動與專案簡報，確保符合校規，並在時間壓力下協調多方利害關係人的行程。",
        },
        tutorABC: {
          period: "2024/08 – 至今",
          title: "線上英語家教老師",
          point1: "一對一線上英語課程，服務國小至高中各年段學生。",
          point2: "備考 IELTS 與劍橋英語認證（YLE、A2 Key、B1 Preliminary、B2 First）。",
          coursesLabel: "授課科目",
          courseGradeSchool: "英文（國小）",
          courseMiddle: "英文（國中）",
          courseHigh: "英文（高中）",
          stat1: "授課天數",
          stat2: "學生人數",
          stat3: "課堂數",
          stat4: "追蹤人數",
          stat5: "教師發言比（TTT）",
        },
        research: {
          period: "2023/06 – 2023/12",
          title: "研究助理",
          point1: "蒐集、整理並分析研究所需數據。",
          point2: "撰寫摘要並製作研討會相關資料。",
          dataPoint1: "透過 R 與 Excel 以量化和質化雙重研究方法分析宏觀經濟議題，確保交付成果的嚴謹性。",
          dataPoint2: "資料蒐集、清洗與處理；撰寫量化摘要並製作研討會與學術會議的支援資料。",
          finCompany: "國立政治大學國際關係研究中心",
          finPoint1: "運用質化調查與量化迴歸方法，分析經濟趨勢與數據集。",
        },
        filterAll: "全部",
        filterTeaching: "教學",
        filterFinance: "金融",
        filterMarketing: "行銷",
        viewAll: "顯示全部",
        subtitleMarketing: "社群媒體、績效行銷、內容創作與社群經營。",
        subtitleData: "數據分析、儀表板與市場研究。",
        subtitleFinance: "財務、數據分析與策略顧問。",
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
        packaging: {
          title: "包裝設計競賽 – 第十八屆鵬華獎",
          desc: "參加 2024 年第十八屆鵬華獎包裝設計競賽，製作徵件活動宣傳視覺素材。",
        },
        insightLbl: "關鍵洞察",
        mkt: {
          heroEyebrow: "曾羽庭 · 精選作品 · 2024–2025",
          heroDesc: "數據導向的行銷活動、視覺設計與社群管理 — 在創意與分析之間找到精準的交集。",
          heroStatProjets: "作品",
          heroStatGrowth: "小紅書成長率",
          heroStatPart: "AIESEC 參與人數",
          filterAll: "全部",
          filterDashboard: "數據儀表板",
          filterCampagne: "行銷活動",
          filterDesign: "視覺設計",
          filterCommunity: "社群管理",
          engoo: {
            num: "01 · 完整案例分析",
            tag: "Excel 儀表板 · 社群分析 · A/B 測試",
            sitLbl: "情境 · 背景與挑戰",
            actLbl: "行動 · 儀表板架構",
            resLbl: "成果 · 三個月量化影響",
            statMet: "每日追蹤指標",
            statVues: "瀏覽次數 · 3 個月",
            statInter: "互動量",
            statAb: "動態 A/B 比較模組",
          },
          aiesec: {
            num: "02 · 行銷活動",
            tag: "行銷活動 · 視覺方向",
            body: "帶領 AIESEC NCCU 四人行銷團隊，負責 YOLO 國際夏令營的整體行銷策略。設計主視覺與社群貼文，驅動志工與學員招募。",
            statVol: "招募志工人數",
            statPart: "參與人數",
            statBudget: "超出預算目標",
          },
          guzhengNum: "03 · 社群管理",
          penwardsNum: "04 · 視覺設計",
          penwardsTag: "設計 · 競賽",
          footerBack: "← 返回行銷頁面",
          footerNext: "數據與研究作品集 →",
        },
        data: {
          heroDesc: "Excel 儀表板、量化分析與市場研究 — 將嚴謹的數據分析轉化為可執行的商業決策。",
          heroStatProjets: "作品",
          heroStatGrowth: "小紅書成長率",
          heroStatHypo: "M&A 假設數",
          filterAll: "全部",
          filterDashboard: "儀表板",
          filterAnalyse: "分析",
          filterRecherche: "研究",
          filterReporting: "報告",
          dashboard: {
            num: "01 · 儀表板 · 案例分析",
            sitLbl: "情境 · 分析挑戰",
            actLbl: "行動 · 儀表板架構",
            resLbl: "成果 · 三個月量化成效",
            statMet: "每日追蹤指標",
            statVues: "瀏覽次數 · 3 個月",
            statAb: "動態 A/B 比較",
          },
          ma: {
            num: "02 · 實證研究 · 量化金融",
            subtitle: "實證研究（2000–2024）· 3 項假設 · 資料來源：LSEG Workspace / Refinitiv、WGI、POLCON III、FSI",
            sitLbl: "情境",
            actLbl: "研究方法",
            resLbl: "核心發現",
            statHypo: "驗證假設數",
            statPeriod: "分析期間",
            statIndices: "政治指數",
            btn: "閱讀完整報告（PDF）",
          },
          footerBack: "← 行銷作品集",
          footerNext: "金融作品集 →",
        },
        fin: {
          heroDesc: "量化金融與實證建模的學術研究 — 嚴謹的分析方法，產出可應用於投資決策的實質洞察。",
          heroStatProj: "作品",
          heroStatData: "M&A 資料",
          heroStatHypo: "驗證假設數",
          filterAll: "全部",
          filterAnalyse: "分析",
          filterRecherche: "研究",
          filterDistinction: "榮譽",
          ma: {
            num: "01 · 實證研究 · 量化金融",
            subtitle: "實證研究（2000–2024）· 3 項假設 · 資料來源：LSEG Workspace / Refinitiv、WGI、POLCON III、FSI",
            sitLbl: "情境",
            actLbl: "研究方法",
            resLbl: "核心發現",
            statHypo: "驗證假設數",
            statPeriod: "分析期間",
            statIndices: "政治指數",
            btn: "閱讀完整報告（PDF）",
          },
          footerBack: "← 數據與研究作品集",
          footerNext: "首頁 →",
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
          portfolioLink: "查看作品集 (PDF)",
        },
        camps: {
          title: "Sora Education 青少年營隊 共同創辦人",
          text:
            "與兩位夥伴共同規劃並營運五梯次一週營隊，撰寫商業計畫、管理財務與資產，並進行市場調查優化課程與行銷策略。",
          stat1: "營隊場次",
        },
        clubs: {
          title: "其他校園社團參與",
          text:
            "曾參與國際書院交流社、英語演講社（Toastmasters）、弓道社、劍道社與花道社。",
        },
        filterAll: "全部",
        filterVolunteer: "志工服務",
        periodTBD: "時間待確認",
        filterEntrepreneurship: "創業",
        filterClubs: "社團與文化",
        viewAll: "顯示全部",
        restoCoeur: {
          period: "2025/10 – 至今",
          title: "義工 – Restos du Cœur（愛心餐廳）",
          org: "Les Restos du Cœur · 法國人道關懷協會",
          point1: "參與食物發放，協助弱勢族群獲得日常飲食支援。",
          point2: "食物分類與包裝作業。",
        },
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
          stat1: "志工招募人數",
          stat2: "學員人數",
          stat3: "超出目標",
          finTitle: "會員",
          finOrg: "AIESEC NCCU（全球非營利組織，統籌國際志工計畫）",
          finPoint1: "管理夏令營的專案預算與財務預測，優化成本結構，使收支超出目標 53.7%。",
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
          stat1: "參與人數",
          stat2: "語言",
        },
      },
      honors: {
        title: "獎學金與榮譽",
        subtitle: "以成績與表現獲得的獎助與肯定。",
        exchange: {
          title: "教育部公費交換獎學金",
          org: "中華民國教育部",
          text: "以優異成績獲頒，支持赴法交換學習。",
          year: "2024",
        },
        short: {
          title: "政治大學短期出國進修獎學金",
          org: "國立政治大學",
          text: "因學業表現優良，獲補助短期出國進修經費。",
          year: "2024",
        },
        excellence: {
          title: "政治大學書卷獎（前 5% GPA）",
          org: "國立政治大學",
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

    document.querySelectorAll("[data-i18n-href]").forEach((el) => {
      const key = el.getAttribute("data-i18n-href");
      if (!key) return;
      const val = getTranslation(dict, key);
      if (val !== null) el.setAttribute("href", val);
    });

    document.querySelectorAll("[data-i18n-src]").forEach((el) => {
      const key = el.getAttribute("data-i18n-src");
      if (!key) return;
      const val = getTranslation(dict, key);
      if (val !== null) el.setAttribute("src", val);
      // keep the parent <a> href in sync if present
      if (val !== null && el.parentElement && el.parentElement.tagName === "A") {
        el.parentElement.setAttribute("href", val);
      }
    });

    document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
      const key = el.getAttribute("data-i18n-alt");
      if (!key) return;
      const val = getTranslation(dict, key);
      if (val !== null) el.setAttribute("alt", val);
    });

    // Show/hide elements that only make sense in a specific language
    // Usage: data-lang-show="zh"  → visible only when ZH is active
    document.querySelectorAll("[data-lang-show]").forEach((el) => {
      const targetLang = el.getAttribute("data-lang-show");
      el.style.display = targetLang === lang ? "" : "none";
    });

    // HTML-rich elements (use innerHTML, not textContent)
    const philEl = document.getElementById("services-philosophy-text");
    if (philEl && dict.teachingServices?.philosophy) {
      philEl.innerHTML = dict.teachingServices.philosophy;
    }
  }

  const langButtons = document.querySelectorAll(".lang-btn");
  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang") || "fr";
      langButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      applyTranslations(lang);
      try { localStorage.setItem("pf-lang", lang); } catch(e) {}
      // Re-render skill panel if one is open so images swap to the new language
      const activeChip = document.querySelector(".skill-card.is-skill-active[data-skill]");
      if (activeChip) updateSkillPreview(activeChip.getAttribute("data-skill"));
    });
  });

  // Load saved language preference, default to French
  const _savedLang = (() => { try { return localStorage.getItem("pf-lang") || "fr"; } catch(e) { return "fr"; } })();
  const _savedBtn = document.querySelector(`.lang-btn[data-lang="${_savedLang}"]`);
  if (_savedBtn) {
    langButtons.forEach((b) => b.classList.remove("is-active"));
    _savedBtn.classList.add("is-active");
  }
  applyTranslations(_savedLang);

  // Skill preview on hover
  const skillData = {
    "data-r": {
      title: "R – Analyse Statistique",
      text: "Utilisation de RStudio pour l’analyse statistique, la visualisation et les études académiques.",
      byPage: {
        finance:   { text: "Régressions OLS et Logit, analyse de panel et tests d’hypothèses appliqués à la recherche en finance quantitative (M&A, données LSEG)." },
        data:      { text: "Méthodes quantitatives : régressions, ANOVA, visualisations statistiques et études de marché pour des analyses actionnables." },
        marketing: { text: "Études de marché et segmentation : R utilisé pour analyser les données d’audience et valider les stratégies de contenu." },
      },
      en: {
        title: "R – Statistical Analysis",
        text: "Using RStudio for statistical analysis, visualisation and academic research.",
        byPage: {
          finance:   { text: "OLS and logit regressions, panel data analysis and hypothesis testing applied to quantitative finance research (M&A, LSEG data)." },
          data:      { text: "Quantitative methods: regressions, ANOVA, statistical visualisation and market studies for actionable insights." },
          marketing: { text: "Market research and audience segmentation: R used to analyse audience data and validate content strategies." },
        },
      },
      proofs: [
        {
          type: "Cours",
          title: "Marketing Research & Research Methods (R)",
          org: "NCCU",
          meta: ["Cours académique"],
          points: ["Méthodes quantitatives, régressions et visualisation appliquée."],
          actions: [{ label: "Voir la formation", href: "#edu-nccu" }],
        },
        {
          type: "Expérience",
          title: "Assistante de recherche",
          org: "Institut des Relations Internationales (NCCU)",
          meta: ["Taipei · Taïwan", "06/2023 – 12/2023"],
          points: ["Analyse statistique et visualisation pour des travaux de recherche."],
          actions: [{ label: "Voir l’expérience", href: "#exp-research" }],
        },
      ],
    },
    "data-python": {
      title: "Python – Analyse & Automatisation",
      text: "Utilisation de Python pour l’analyse de données, le traitement de fichiers et la création d’outils d’automatisation pour faciliter le travail quotidien.",
      byPage: {
        finance:   { text: "Automatisation de la consolidation de données financières et génération de rapports de performance marketing (CTR, CVR, ROI)." },
        data:      { text: "Scripts de nettoyage de données, calcul d’indicateurs et automatisation de la consolidation de données quotidiennes." },
        marketing: { text: "Script Python d’automatisation de la consolidation des données Xiaohongshu, réduisant le temps de reporting quotidien." },
      },
      en: {
        title: "Python – Analysis & Automation",
        text: "Using Python for data analysis, file processing and automation tools to streamline everyday tasks.",
        byPage: {
          finance:   { text: "Automated financial data consolidation and marketing performance report generation (CTR, CVR, ROI)." },
          data:      { text: "Data cleaning scripts, metric computation and automated daily data consolidation pipelines." },
          marketing: { text: "Python automation script for Xiaohongshu data consolidation, cutting daily reporting time significantly." },
        },
      },
      proofs: [
        {
          type: "Cours",
          title: "Programmation 101 (Python)",
          org: "NCCU",
          meta: ["Cours académique"],
          points: ["Bases de la programmation et application à l’analyse de données."]
        },
        {
          type: "Expérience",
          title: "Assistante de recherche",
          org: "Institut des Relations Internationales (NCCU)",
          meta: ["Taipei · Taïwan", "06/2023 – 12/2023"],
          points: ["Collecte, nettoyage et traitement de données pour la recherche."],
          actions: [{ label: "Voir l’expérience", href: "#exp-research" }],
        },
        {
          type: "Outil Personnel",
          title: "PDF Converter & Merger",
          org: "Python · win32com · pypdf",
          meta: ["Glisser-déposer · Word / PowerPoint / Excel / Images → PDF"],
          points: [
            "Conversion par glisser-déposer de fichiers Word (.docx), PowerPoint (.pptx), Excel (.xlsx) et images (JPG/PNG) en PDF via l’API COM de Microsoft Office.",
            "Fusion automatique de plusieurs PDFs en un fichier unique si tous les fichiers déposés sont déjà des PDFs.",
          ],
        },
        {
          type: "Outil Personnel",
          title: "Auto-Push – Synchronisation automatique GitHub",
          org: "Git CLI · Batch Script",
          meta: ["Surveillance fichiers · git commit + push · toutes les 100s"],
          points: [
            "Script de surveillance qui détecte les modifications locales toutes les 100 secondes et exécute automatiquement git add → commit → push vers la branche main.",
            "Maintient en permanence les fichiers locaux synchronisés avec GitHub sans intervention manuelle.",
          ],
        },
      ],
    },
    "data-sql": {
      title: "SQL – Requêtes & Bases de Données",
      text: "Rédaction de requêtes SQL pour interroger, filtrer, agréger et joindre des bases de données. Environnement principal : Microsoft Access (SQL intégré) et requêtes analytiques.",
      proofs: [
        {
          type: "Cours",
          title: "Introduction to Data Analysis & Programming (VBA & Access)",
          org: "NCCU – Université Nationale Chengchi",
          meta: ["Cours académique"],
          points: [
            "Requêtes SELECT, WHERE, JOIN, GROUP BY et agrégations sur bases relationnelles.",
            "Création et gestion de tables, formulaires et rapports automatisés.",
          ],
          actions: [{ label: "Voir la formation", href: "#edu-nccu" }],
        },
      ],
    },
    "data-powerbi": {
      title: "Power BI – Tableaux De Bord",
      text: "Construction de tableaux de bord interactifs pour suivre les performances marketing et financières.",
      proofs: [],
    },
    "data-tableau": {
      title: "Tableau – Visualisation De Données",
      text: "Création de visualisations interactives pour explorer et communiquer des indicateurs clés.",
      proofs: [],
    },
    "data-statistics": {
      title: "Statistiques & Méthodes Quantitatives",
      text: "Maîtrise des méthodes quantitatives — régression OLS et Logit, analyse de panel, tests d'hypothèses, statistiques descriptives et inférentielles — appliquées à la recherche académique et aux études de marché.",
      byPage: {
        finance:   { text: "Régressions OLS et Logit sur données LSEG/Refinitiv (2000–2024) pour tester l'impact du risque politique sur les opérations M&A." },
        data:      { text: "Méthodes quantitatives appliquées : régressions multivariées, analyse de corrélation et tests d'hypothèses pour la recherche et l'analyse de marché." },
        marketing: { text: "A/B testing statistique et segmentation d'audience pour mesurer l'impact des créas et identifier les leviers de croissance sur Xiaohongshu." },
      },
      en: {
        title: "Statistics & Quantitative Methods",
        text: "Proficient in quantitative methods — OLS and logit regression, panel data analysis, hypothesis testing, descriptive and inferential statistics — applied to academic research and market studies.",
        byPage: {
          finance:   { text: "OLS and logit regressions on LSEG/Refinitiv data (2000–2024) to test the impact of political risk on M&A transactions." },
          data:      { text: "Applied quantitative methods: multivariate regressions, correlation analysis and hypothesis testing for research and market analysis." },
          marketing: { text: "Statistical A/B testing and audience segmentation to measure creative impact and identify growth drivers on Xiaohongshu." },
        },
      },
      proofs: [
        {
          type: "Cours",
          title: "Research Methods (R & Statistics)",
          org: "NCCU – Université Nationale Chengchi",
          meta: ["Cours académique", "R Studio"],
          points: [
            "Régression linéaire et logistique, ANOVA, tests de corrélation.",
            "Visualisation statistique et interprétation des résultats pour la prise de décision.",
          ],
          actions: [{ label: "Voir la formation", href: "#edu-nccu" }],
        },
        {
          type: "Projet académique",
          title: "Risky Deals – M&A & Risque Politique (Amérique Latine)",
          org: "emlyon business school",
          meta: ["R · OLS · Logit · Panel Data"],
          points: [
            "3 hypothèses testées sur données empiriques 2000–2024 (LSEG / Refinitiv, WGI, POLCON III).",
            "Régression OLS panel (H1 volume M&A), modèle Logit (H2 abandon), OLS sur prime d'acquisition (H3).",
          ],
          actions: [{ label: "Voir le rapport", href: "assets/R_M%26A%20Deal%20Analysis/RECAPSS_Group%202_Final%20Paper.pdf" }],
        },
        {
          type: "Certification",
          title: "Data Literacy",
          org: "—",
          meta: ["05/2026"],
          points: ["Lecture critique des données, interprétation des biais et communication des résultats."],
          actions: [{ label: "Ouvrir le certificat", href: "certificates/Data%20Liyeracy_TSENG%20Yu-Ting%20-%202026-05-16.pdf" }],
        },
      ],
    },
    "data-excel": {
      title: "Excel · TOSA 950/1000",
      text:
        "Modèles Excel avancés, suivi de KPIs et automatisation de reportings.",
      proofs: [
        {
          type: "Expérience",
          title: "Assistante Marketing",
          org: "Engoo",
          meta: ["Taipei · Taïwan", "10/2024 – 02/2025"],
          points: ["Dashboard de suivi de performance marketing et automatisation de rapports."],
          actions: [{ label: "Voir l’expérience", href: "#exp-engoo" }],
        },
        {
          type: "Expérience",
          title: "Assistante Marketing Digital",
          org: "KPN",
          meta: ["Taipei · Taïwan", "01/2025 – 06/2025"],
          points: [
            "Suivi mensuel des KPIs SEO/SEA (trafic, CTR, conversions) et consolidation des rapports clients sous Excel.",
          ],
          actions: [{ label: "Voir l'expérience", href: "#exp-kpn" }],
        },
        {
          type: "Cours",
          title: "Introduction to Data Analysis and Programming (VBA & Access)",
          org: "NCCU – Université Nationale Chengchi",
          meta: ["Cours académique"],
          points: [
            "Modélisation avancée, fonctions complexes et gestion de larges volumes de données.",
          ],
          actions: [{ label: "Voir la formation", href: "#edu-nccu" }],
        },
        {
          type: "Certification",
          title: "TOSA 950/1000",
          meta: ["10/2025"],
          points: ["Score 950/1000 – niveau expert en modélisation, tableaux croisés dynamiques et automatisation."],
        },
      ],
      imagesByLang: {
        fr: [
          { src: "assets/Engoo Dashboard_FR.png", alt: "Tableau de bord de performance – Engoo XHS" },
          { src: "assets/Engoo Data_FR.png",      alt: "Données brutes – Engoo XHS" },
        ],
        en: [
          { src: "assets/Engoo Dashboard_EN.png", alt: "Performance Dashboard – Engoo XHS" },
          { src: "assets/Engoo Data_EN.png",      alt: "Raw Data – Engoo XHS" },
        ],
        zh: [
          { src: "assets/Engoo Dashboard_EN.png", alt: "Performance Dashboard – Engoo XHS" },
          { src: "assets/Engoo Data_EN.png",      alt: "Raw Data – Engoo XHS" },
        ],
      },
      byPage: {
        finance:   { text: "Modèles Excel avancés pour le reporting financier, le suivi de KPIs (CTR, CVR, ROI) et la gestion de budgets publicitaires mensuels." },
        data:      { text: "Dashboard Excel dynamique (Tableaux Croisés, Formules imbriquées) pour suivre 12 métriques quotidiennes et comparer des périodes A/B." },
        marketing: { text: "Suivi de la performance des campagnes : automatisation du tableau de bord XHS (12 KPIs/jour, comparaison A/B de périodes)." },
      },
      en: {
        title: "Excel – TOSA 950/1000",
        text:  "Advanced Excel models, KPI tracking and automated reporting.",
        byPage: {
          finance:   { text: "Advanced Excel models for financial reporting, KPI tracking (CTR, CVR, ROI) and monthly ad-budget management." },
          data:      { text: "Dynamic Excel dashboard (Pivot Tables, nested formulas) tracking 12 daily metrics with automated A/B period comparison." },
          marketing: { text: "Campaign performance tracking: built and automated the XHS dashboard (12 KPIs/day, A/B period comparison) to optimise content strategy." },
        },
      },
    },
    "data-access": {
      title: "Microsoft Access – Bases de Données",
      text: "Création et gestion de bases de données relationnelles, requêtes SQL et automatisation de rapports dans Access.",
      proofs: [
        {
          type: "Cours",
          title: "Introduction to Data Analysis and Programming (VBA & Access)",
          org: "NCCU – Université Nationale Chengchi",
          meta: ["Cours académique"],
          points: [
            "Modélisation de bases de données relationnelles, rédaction de requêtes SQL dans Access.",
            "Création de formulaires et automatisation de rapports.",
          ],
          actions: [{ label: "Voir la formation", href: "#edu-nccu" }],
        },
      ],
    },
    "mkt-seo": {
      title: "SEO On‑Page & Technique",
      text:
        "Audit SEO, optimisation de contenus et recherche de facteurs de classement Google.",
      proofs: [
        {
          type: "Expérience",
          title: "Assistante Marketing Digital",
          org: "KPN",
          meta: ["Taipei · Taïwan", "01/2025 – 06/2025"],
          points: [
            "Optimisation SEO (on‑page / technique) et recommandations de contenus.",
            "Suivi de KPIs (trafic, CTR, conversions).",
          ],
          actions: [{ label: "Voir l’expérience", href: "#exp-kpn" }],
        },
        {
          type: "Certification",
          title: "Google – Programme Marketing Digital",
          org: "Google 數位人才探索計畫",
          meta: ["Marketing digital"],
          points: ["Certification SEO, SEA, analytics et stratégie de contenu."],
          actions: [{ label: "Ouvrir le certificat", href: "certificates/Google數位人才探索計畫_證照.pdf" }],
        },
      ],
    },
    "mkt-sea": {
      title: "SEA · Google Ads",
      text: "Gestion de campagnes Google Ads orientées performance (CTR, CVR) et optimisation budgétaire.",
      proofs: [
        {
          type: "Expérience",
          title: "Assistante Marketing Digital",
          org: "KPN",
          meta: ["Taipei · Taïwan", "01/2025 – 06/2025"],
          points: ["Campagnes Google Ads, suivi CTR et conversions."],
          actions: [{ label: "Voir l'expérience", href: "#exp-kpn" }],
        },
        {
          type: "Certification",
          title: "Google Ads – Annonces de Recherche",
          org: "Google",
          meta: ["Google Ads"],
          points: ["Certification officielle Google Ads Recherche."],
          actions: [{ label: "Ouvrir le certificat", href: "certificates/Google%20Ads%20搜尋廣告認證.png" }],
        },
        {
          type: "Certification",
          title: "Google Ads – Annonces Vidéo",
          org: "Google",
          meta: ["Google Ads"],
          points: ["Certification officielle Google Ads Vidéo."],
          actions: [{ label: "Ouvrir le certificat", href: "certificates/Google%20Ads%20影片廣告認證.png" }],
        },
        {
          type: "Certification",
          title: "Publicité efficace assistée par l'IA",
          org: "Google",
          meta: ["Google Ads · IA"],
          points: ["Certification Google Ads – exploitation de l'IA pour la performance publicitaire."],
          actions: [{ label: "Ouvrir le certificat", href: "certificates/AI%20技術輔助高效廣告認證.png" }],
        },
      ],
    },
    "mkt-social": {
      title: "Social Media (Xiaohongshu, Meta)",
      text:
        "Création de contenu et optimisation de la visibilité sur Xiaohongshu (RED) et les réseaux sociaux Meta.",
      proofs: [
        {
          type: "Expérience",
          title: "Assistante Marketing",
          org: "Engoo",
          meta: ["Taipei · Taïwan", "10/2024 – 02/2025"],
          points: ["Contenus et optimisation de visibilité sur plateformes social media."],
          actions: [{ label: "Voir l’expérience", href: "#exp-engoo" }],
        },
      ],
    },
    "mkt-research": {
      title: "Études De Marché & Positionnement",
      text:
        "Analyses de marché pour orienter la stratégie de contenu et le positionnement, avec segmentation et veille concurrentielle.",
      proofs: [
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
    "mkt-analytics": {
      title: "Google Analytics",
      text: "Analyse du trafic web, segmentation des audiences et suivi des conversions via Google Analytics.",
      proofs: [
        {
          type: "Certification",
          title: "Google Analytics",
          org: "Google",
          meta: ["Analytics"],
          points: ["Certification officielle Google Analytics – analyse d'audience et suivi des performances."],
          actions: [{ label: "Ouvrir le certificat", href: "certificates/Google%20Analytics%20Certificate.pdf" }],
        },
        {
          type: "Expérience",
          title: "Assistante Marketing Digital",
          org: "KPN",
          meta: ["Taipei · Taïwan", "01/2025 – 06/2025"],
          points: ["Suivi de performance et analyse du trafic web (Google Analytics + Search Console)."],
          actions: [{ label: "Voir l'expérience", href: "#exp-kpn" }],
        },
      ],
    },
    "mkt-design": {
      title: "Création De Contenu & Design Visuel",
      text: "Conception de visuels pour les réseaux sociaux, événements et supports de communication.",
      proofs: [
        {
          type: "Expérience",
          title: "Assistante Marketing",
          org: "Engoo",
          meta: ["Taipei · Taïwan", "10/2024 – 02/2025"],
          points: ["A/B testing de visuels et adaptation des créas par sous-segment cible."],
          actions: [{ label: "Voir l'expérience", href: "#exp-engoo" }],
        },
        {
          type: "Portfolio",
          title: "Photographie & supports promotionnels",
          org: "Portfolio",
          meta: ["Canva · Photoshop"],
          points: ["Affiches, badges et publications pour des clubs et événements."],
          actions: [{ label: "Voir le portfolio", href: "#portfolio" }],
        },
        {
          type: "Certification",
          title: "Google Ads – Créations publicitaires",
          org: "Google",
          meta: ["Google Ads"],
          points: ["Certification Google Ads sur la conception de créas publicitaires performantes."],
          actions: [{ label: "Ouvrir le certificat", href: "certificates/Google%20Ads%20廣告素材認證.png" }],
        },
      ],
    },
    "prog-python": {
      title: "Python Pour L’Analyse De Données",
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
      title: "VBA – Macros & Automatisation",
      text: "Macros VBA pour automatiser le traitement de données, la mise à jour de dashboards et la génération de rapports.",
      proofs: [
        {
          type: "Expérience",
          title: "Assistante Marketing",
          org: "Engoo",
          meta: ["Taipei · Taïwan", "10/2024 – 02/2025"],
          points: [
            "Développement de macros VBA pour automatiser la mise à jour du dashboard de performance XHS et la génération de rapports hebdomadaires.",
          ],
          actions: [{ label: "Voir l'expérience", href: "#exp-engoo" }],
        },
        {
          type: "Cours",
          title: "Introduction to Data Analysis and Programming (VBA & Access)",
          org: "NCCU – Université Nationale Chengchi",
          meta: ["Cours académique"],
          points: [
            "Conception et exécution de macros VBA pour automatiser l'analyse de données et le reporting.",
          ],
          actions: [{ label: "Voir la formation", href: "#edu-nccu" }],
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
      title: "Green Finance & Risk Management",
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
      title: "Operational Decision Analysis",
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
      title: "International Finance",
      text:
        "Fondamentaux de la finance internationale et des marchés de capitaux.",
      links: [
        {
          label: "Cours International Finance – NCCU",
          href: "#edu-nccu",
        },
      ],
    },
    // ── Finance – Analyse & Contrôle de Gestion ─────────────────────
    "fin-accounting": {
      title: "Financial Accounting",
      text: "Maîtrise des états financiers (bilan, compte de résultat, flux de trésorerie), des normes comptables et de la comptabilité en partie double.",
      proofs: [
        {
          type: "Formation",
          title: "Spécialisation Finance & Comptabilité",
          org: "emlyon business school",
          meta: ["Lyon · France", "2023 – Présent"],
          points: ["Financial Accounting : états financiers, consolidation, analyse des comptes annuels."],
          actions: [{ label: "Voir la formation", href: "#education" }],
        },
      ],
    },
    "fin-pnl": {
      title: "P&L Analysis",
      text: "Analyse du compte de résultat pour identifier les leviers de rentabilité, décomposer les marges et piloter la performance.",
      proofs: [
        {
          type: "Expérience",
          title: "Assistante Marketing Digital",
          org: "KPN",
          meta: ["Taipei · Taïwan", "01/2025 – 06/2025"],
          points: ["Suivi de la performance financière des campagnes : ROI, coût par acquisition, taux de conversion (+5,1% CVR)."],
          actions: [{ label: "Voir l'expérience", href: "#experience" }],
        },
        {
          type: "Activité",
          title: "Co-Fondatrice – Sora Education",
          org: "Projet entrepreneurial",
          meta: ["Camps de jeunesse"],
          points: ["Suivi du P&L de 5 camps d'été : pilotage des revenus, des coûts variables et fixes, et atteinte de la rentabilité."],
          actions: [{ label: "Voir activités", href: "#extracurricular" }],
        },
      ],
    },
    "fin-modeling": {
      title: "Financial Modeling",
      text: "Construction de modèles financiers pour la prévision budgétaire, la valorisation et l'analyse de scénarios.",
      proofs: [
        {
          type: "Formation",
          title: "Spécialisation Finance & Comptabilité",
          org: "emlyon business school",
          meta: ["Lyon · France", "2023 – Présent"],
          points: ["Modélisation financière : projections, valorisation et analyse de sensibilité."],
          actions: [{ label: "Voir la formation", href: "#education" }],
        },
      ],
    },
    "fin-variance": {
      title: "Variance Analysis",
      text: "Analyse des écarts entre prévisions et réalisations pour identifier les causes de sur- ou sous-performance et recommander des actions correctives.",
      proofs: [
        {
          type: "Formation",
          title: "Spécialisation Finance & Comptabilité",
          org: "emlyon business school",
          meta: ["Lyon · France", "2023 – Présent"],
          points: ["Analyse des écarts budgétaires (prix, volume, mix) et identification des leviers d'action."],
          actions: [{ label: "Voir la formation", href: "#education" }],
        },
        {
          type: "Expérience",
          title: "Assistante Marketing Digital",
          org: "KPN",
          meta: ["Taipei · Taïwan", "01/2025 – 06/2025"],
          points: ["Analyse des écarts de performance marketing (CTR, CVR) vs benchmarks mensuels et formulation de recommandations."],
          actions: [{ label: "Voir l'expérience", href: "#experience" }],
        },
      ],
    },
    "fin-cost-control": {
      title: "Channel & Cost Control",
      text: "Pilotage des coûts par canal et optimisation des structures de coûts pour maximiser la rentabilité.",
      proofs: [
        {
          type: "Expérience",
          title: "Assistante Marketing Digital",
          org: "KPN",
          meta: ["Taipei · Taïwan", "01/2025 – 06/2025"],
          points: ["Gestion des budgets publicitaires mensuels Facebook & Google Ads et optimisation du coût par acquisition (conversion rate +5.1%)."],
          actions: [{ label: "Voir l'expérience", href: "#experience" }],
        },
        {
          type: "Activité",
          title: "Membre – AIESEC in NCCU",
          org: "AIESEC",
          meta: ["Taipei · Taïwan", "09/2024 – 06/2025"],
          points: ["Gestion budgétaire d'un camp d'été : optimisation de la structure de coûts, dépassement de l'objectif de rentabilité de 53,7%."],
          actions: [{ label: "Voir activités", href: "#extracurricular" }],
        },
      ],
    },
    "fin-management": {
      title: "Management Accounting",
      text: "Utilisation des données comptables pour la prise de décision interne : budgeting, reporting de gestion et contrôle de performance.",
      proofs: [
        {
          type: "Formation",
          title: "Spécialisation Finance & Comptabilité",
          org: "emlyon business school",
          meta: ["Lyon · France", "2023 – Présent"],
          points: ["Management Accounting : budgeting, cost allocation, performance measurement et reporting de gestion."],
          actions: [{ label: "Voir la formation", href: "#education" }],
        },
        {
          type: "Activité",
          title: "Co-Fondatrice – Sora Education",
          org: "Projet entrepreneurial",
          meta: ["Camps de jeunesse"],
          points: ["Reporting financier mensuel pour 5 camps d'été : suivi budgétaire, analyse des coûts et pilotage de la rentabilité."],
          actions: [{ label: "Voir activités", href: "#extracurricular" }],
        },
      ],
    },

    "soft-communication": {
      title: "Communication & Prise De Parole",
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
      title: "Leadership & Gestion D’Équipe",
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
      title: "Gestion De Projet & Organisation",
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
      title: "Travail Interculturel",
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
          points: ["Programme dispensé entièrement en anglais – cours, projets et travaux de groupe."],
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
      title: "Mandarin – Langue Maternelle",
      text: "Mandarin en tant que langue maternelle, utilisé dans tous les contextes professionnels et personnels.",
      proofs: [],
    },
    "lang-mandarin-teaching": {
      title: "Mandarin – Langue Maternelle",
      text: "Mandarin en tant que langue maternelle, avec une expérience de bénévolat auprès d'élèves issus de familles pluriculturelles.",
      proofs: [
        {
          type: "Bénévolat",
          title: "Bénévole – Projet USR (Responsabilité Sociale Universitaire)",
          org: "Université Nationale Chengchi · Bureau USR",
          meta: ["Taipei · Taïwan", "09/2024 – Présent"],
          points: [
            "Soutien linguistique et culturel auprès d'élèves issus de familles transnationales (新住民二代 / enfants de migrants).",
          ],
          actions: [{ label: "Voir l'engagement", href: "#engagement" }],
        },
      ],
    },

    // ── Data & Analytics (nouvelles entrées) ─────────────────────────
    "data-kpi": {
      title: "KPI Tracking & Reporting",
      text: "Suivi de KPIs marketing et business, construction de tableaux de bord et reporting périodique.",
      proofs: [
        {
          type: "Expérience",
          title: "Assistante Marketing",
          org: "Engoo",
          meta: ["Taipei · Taïwan", "10/2024 – 02/2025"],
          points: [
            "Construction et suivi de dashboards KPIs (acquisition, engagement, rétention).",
            "Reporting hebdomadaire et analyse des tendances de performance.",
          ],
          actions: [{ label: "Voir l'expérience", href: "#exp-engoo" }],
        },
        {
          type: "Expérience",
          title: "Assistante Marketing Digital",
          org: "KPN",
          meta: ["Taipei · Taïwan", "01/2025 – 06/2025"],
          points: ["Suivi mensuel de KPIs SEO/SEA (trafic, CTR, conversions) et reporting client."],
          actions: [{ label: "Voir l'expérience", href: "#exp-kpn" }],
        },
      ],
    },
    "data-segmentation": {
      title: "Customer Segmentation",
      text: "Segmentation d'audiences et de marchés pour orienter les décisions marketing et commerciales.",
      proofs: [
        {
          type: "Projet",
          title: "Étude De Marché – Marque Lifestyle",
          org: "Projet académique",
          meta: ["Europe · Asie"],
          points: [
            "Segmentation des cibles et définition de personas.",
            "Recommandations stratégiques différenciées par segment.",
          ],
        },
        {
          type: "Expérience",
          title: "Assistante Marketing",
          org: "Engoo",
          meta: ["Taipei · Taïwan", "10/2024 – 02/2025"],
          points: [
            "A/B testing de créas par sous-segment cible.",
            "Analyse comportementale des audiences sur les plateformes sociales.",
          ],
          actions: [{ label: "Voir l'expérience", href: "#exp-engoo" }],
        },
      ],
    },
    "data-ab": {
      title: "A/B Testing",
      text: "Conception et analyse de tests A/B pour optimiser les créas, messages et parcours utilisateur.",
      proofs: [
        {
          type: "Expérience",
          title: "Assistante Marketing",
          org: "Engoo",
          meta: ["Taipei · Taïwan", "10/2024 – 02/2025"],
          points: [
            "Tests A/B sur visuels publicitaires et copies par sous-segment.",
            "Analyse des résultats et recommandations d'optimisation.",
          ],
          actions: [{ label: "Voir l'expérience", href: "#exp-engoo" }],
        },
      ],
    },

    // ── Marketing Digital (nouvelles entrées) ────────────────────────
    "mkt-campaign": {
      title: "Planification De Campagnes",
      text: "Planification, coordination et suivi de campagnes marketing multicanal (SEO, SEA, social media, emailing).",
      proofs: [
        {
          type: "Expérience",
          title: "Assistante Marketing Digital",
          org: "KPN",
          meta: ["Taipei · Taïwan", "01/2025 – 06/2025"],
          points: [
            "Planification et coordination de campagnes digitales multicanal.",
            "Suivi budgétaire et reporting de performance.",
          ],
          actions: [{ label: "Voir l'expérience", href: "#exp-kpn" }],
        },
        {
          type: "Activité",
          title: "Co‑Fondatrice – Sora Education",
          org: "Projet entrepreneurial",
          meta: ["Camps de jeunesse"],
          points: ["Planification et exécution de campagnes de recrutement pour 5 camps d'été."],
          actions: [{ label: "Voir activités", href: "#extracurricular" }],
        },
      ],
    },
    // ── Consulting & Strategy ────────────────────
    "cons-strategy": {
      title: "Analyse Stratégique (SWOT, PESTEL, Porter)",
      text: "Analyse d'entreprises et de marchés via les frameworks SWOT, PESTEL et les 5 forces de Porter.",
      proofs: [
        {
          type: "Expérience",
          title: "Assistante Marketing",
          org: "Engoo",
          meta: ["Taipei · Taïwan", "10/2024 – 02/2025"],
          points: ["Analyse de marché et positionnement concurrentiel pour la stratégie de contenu REDnote."],
          actions: [{ label: "Voir l'expérience", href: "#exp-engoo" }],
        },
        {
          type: "Activité",
          title: "Co‑Fondatrice – Sora Education",
          org: "Projet entrepreneurial",
          meta: ["Camps de jeunesse"],
          points: ["Études de marché, segmentation et positionnement de l'offre de cours."],
          actions: [{ label: "Voir activités", href: "#extracurricular" }],
        },
      ],
    },
    "cons-benchmark": {
      title: "Benchmarking Concurrentiel",
      text: "Analyse comparative des acteurs du marché pour identifier des opportunités de positionnement et de différenciation.",
      proofs: [
        {
          type: "Expérience",
          title: "Assistante Marketing",
          org: "Engoo",
          meta: ["Taipei · Taïwan", "10/2024 – 02/2025"],
          points: ["Veille concurrentielle approfondie pour optimiser la stratégie de contenu sur le segment du chinois simplifié."],
          actions: [{ label: "Voir l'expérience", href: "#exp-engoo" }],
        },
        {
          type: "Expérience",
          title: "Assistante Marketing Digital",
          org: "KPN",
          meta: ["Taipei · Taïwan", "01/2025 – 06/2025"],
          points: ["Benchmarks concurrentiels approfondis et analyse de positionnement SEO/SEA."],
          actions: [{ label: "Voir l'expérience", href: "#exp-kpn" }],
        },
      ],
    },
    "cons-business-case": {
      title: "Business Case & Recommandations",
      text: "Structuration et présentation de business cases avec recommandations actionnables et chiffrage.",
      proofs: [
        {
          type: "Activité",
          title: "Co‑Fondatrice – Sora Education",
          org: "Projet entrepreneurial",
          meta: ["Camps de jeunesse"],
          points: ["Business plan, modèle économique et pitch pour 5 camps d'été."],
          actions: [{ label: "Voir activités", href: "#extracurricular" }],
        },
      ],
    },
    "cons-storytelling": {
      title: "Storytelling & Présentations",
      text: "Conception de présentations impactantes (slides, pitch, soutenance) pour convaincre des audiences professionnelles.",
      proofs: [
        {
          type: "Activité",
          title: "Toastmasters – Prise De Parole",
          org: "Clubs étudiants – NCCU",
          meta: ["Anglais · Mandarin"],
          points: ["Prise de parole structurée et storytelling en anglais et mandarin."],
          actions: [{ label: "Voir activités", href: "#extracurricular" }],
        },
        {
          type: "Expérience",
          title: "Déléguée – Nuit Des Idées",
          org: "Institut Français de Taïwan",
          meta: ["2022"],
          points: ["Présentation et animation en contexte interculturel franco-taïwanais."],
          actions: [{ label: "Voir activités", href: "#volunteer" }],
        },
      ],
    },
    "ai-tools": {
      title: "Outils IA (ChatGPT, Claude, Gemini)",
      text: "Utilisation quotidienne des principaux modèles d'IA générative pour la rédaction, l'analyse, la génération de code et la productivité.",
      proofs: [
        {
          type: "Cours",
          title: "Data Science & AI for Business",
          org: "emlyon business school",
          meta: ["Lyon · France"],
          points: [
            "Fondements du machine learning appliqués au contexte business.",
            "Cas d'usage de l'IA pour la prise de décision et l'automatisation.",
          ],
          actions: [{ label: "Voir la formation", href: "#edu-emlyon" }],
        },
        {
          type: "Pratique",
          title: "Utilisation quotidienne – Production & Analyse",
          org: "Usage professionnel & académique",
          meta: ["ChatGPT · Claude · Gemini · Perplexity"],
          points: [
            "Génération et optimisation de contenus marketing.",
            "Analyse de données et synthèse de recherches.",
            "Automatisation de tâches répétitives.",
          ],
        },
      ],
    },
    "ai-ads": {
      title: "Publicité Assistée par l'IA",
      text: "Exploitation des fonctionnalités IA de Google Ads pour optimiser les campagnes publicitaires (Performance Max, Smart Bidding).",
      proofs: [
        {
          type: "Certification",
          title: "Publicité efficace assistée par l'IA",
          org: "Google",
          meta: ["Google Ads · IA"],
          points: ["Certification Google Ads – exploitation de l'IA pour la performance publicitaire."],
          actions: [{ label: "Ouvrir le certificat", href: "certificates/AI%20技術輔助高效廣告認證.png" }],
        },
        {
          type: "Expérience",
          title: "Assistante Marketing Digital",
          org: "KPN",
          meta: ["Taipei · Taïwan", "01/2025 – 06/2025"],
          points: ["Campagnes Google Ads avec optimisation automatique (Smart Bidding, Performance Max)."],
          actions: [{ label: "Voir l'expérience", href: "#exp-kpn" }],
        },
      ],
    },
    "ai-business": {
      title: "IA Pour Les Affaires",
      text: "Compréhension des enjeux stratégiques de l'IA pour les entreprises : transformation digitale, automatisation et nouveaux modèles de valeur.",
      proofs: [
        {
          type: "Cours",
          title: "Data Science & AI for Business",
          org: "emlyon business school",
          meta: ["Lyon · France"],
          points: [
            "Applications business du machine learning : prédiction, segmentation, recommandation.",
            "Analyse de l'impact de l'IA sur les stratégies d'entreprise.",
          ],
          actions: [{ label: "Voir la formation", href: "#edu-emlyon" }],
        },
        {
          type: "Certification",
          title: "Publicité efficace assistée par l'IA",
          org: "Google",
          meta: ["Google Ads · IA"],
          points: ["Mise en pratique de l'IA pour la performance marketing."],
          actions: [{ label: "Ouvrir le certificat", href: "certificates/AI%20技術輔助高效廣告認證.png" }],
        },
      ],
    },

    // ── Individual AI Tools ──────────────────────────────────────────
    "ai-chatgpt": {
      title: "ChatGPT",
      text: "Utilisation quotidienne de ChatGPT pour la rédaction, la synthèse, l'analyse et la génération de code.",
      proofs: [{ type: "Pratique", title: "Usage professionnel & académique", org: "OpenAI", meta: ["Quotidien"], points: ["Rédaction de contenus marketing, synthèse de documents, assistance au code."] }],
      en: { title: "ChatGPT", text: "Daily use of ChatGPT for writing, summarisation, analysis and code generation.", proofs: [{ type: "Practice", title: "Professional & Academic Use", org: "OpenAI", meta: ["Daily"], points: ["Marketing content writing, document summarisation, coding assistance."] }] },
    },
    "ai-claude": {
      title: "Claude",
      text: "Utilisation de Claude pour des analyses approfondies, la rédaction professionnelle et la gestion de longs contextes.",
      proofs: [{ type: "Pratique", title: "Usage professionnel & académique", org: "Anthropic", meta: ["Quotidien"], points: ["Rédaction avancée, analyse de données textuelles, synthèse de recherches."] }],
      en: { title: "Claude", text: "Using Claude for in-depth analysis, professional writing and long-context document handling.", proofs: [{ type: "Practice", title: "Professional & Academic Use", org: "Anthropic", meta: ["Daily"], points: ["Advanced writing, text data analysis, research synthesis."] }] },
    },
    "ai-gemini": {
      title: "Gemini",
      text: "Utilisation de Gemini pour la recherche multimodale, la veille et l'intégration avec les outils Google Workspace.",
      proofs: [{ type: "Pratique", title: "Recherche & productivité", org: "Google", meta: ["Régulier"], points: ["Recherche multimodale, résumé de sources, intégration Google Docs/Sheets."] }],
      en: { title: "Gemini", text: "Using Gemini for multimodal research, market intelligence and Google Workspace integration.", proofs: [{ type: "Practice", title: "Research & Productivity", org: "Google", meta: ["Regular"], points: ["Multimodal research, source summarisation, Google Docs/Sheets integration."] }] },
    },
    "ai-vibe-coding": {
      title: "Vibe Coding",
      text: "Développement assisté par l'IA — utilisation de modèles génératifs pour prototyper, déboguer et produire du code de manière interactive.",
      proofs: [{ type: "Projet Personnel", title: "Portfolio & outils d'automatisation", org: "Claude Code · Cursor", meta: ["Python · HTML/CSS · JS"], points: ["Construction de ce portfolio et de scripts d'automatisation via des workflows de vibe coding."] }],
      en: { title: "Vibe Coding", text: "AI-assisted development — using generative models to prototype, debug and produce code interactively.", proofs: [{ type: "Personal Project", title: "Portfolio & Automation Tools", org: "Claude Code · Cursor", meta: ["Python · HTML/CSS · JS"], points: ["Built this portfolio and automation scripts via vibe coding workflows."] }] },
    },

    // ── Microsoft Office Suite ────────────────────────────────────────
    "office-microsoft": {
      title: "Microsoft Office (Word · Excel · PowerPoint)",
      text: "Maîtrise de la suite Microsoft Office pour la rédaction de documents professionnels, la modélisation de données et la création de présentations impactantes.",
      proofs: [
        { type: "Certification", title: "TOSA Excel 950/1000", org: "TOSA", meta: ["10/2025"], points: ["Score expert en modélisation, tableaux croisés et automatisation."] },
        { type: "Expérience", title: "Assistante Marketing", org: "Engoo", meta: ["Taipei · Taïwan", "10/2024 – 02/2025"], points: ["Dashboard Excel et reporting hebdomadaire."], actions: [{ label: "Voir l'expérience", href: "#exp-engoo" }] },
      ],
      en: {
        title: "Microsoft Office (Word · Excel · PowerPoint)",
        text: "Proficient in the Microsoft Office suite for professional document writing, data modelling and impactful presentation design.",
        proofs: [
          { type: "Certification", title: "TOSA Excel 950/1000", org: "TOSA", meta: ["10/2025"], points: ["Expert score in modelling, pivot tables and automation."] },
          { type: "Experience", title: "Marketing Assistant", org: "Engoo", meta: ["Taipei · Taiwan", "10/2024 – 02/2025"], points: ["Excel dashboard and weekly reporting."], actions: [{ label: "View experience", href: "#exp-engoo" }] },
        ],
      },
    },
    "office-google-suite": {
      title: "Google Suite",
      text: "Utilisation quotidienne de Google Workspace (Docs, Sheets, Slides, Drive, Gmail) pour la collaboration et la productivité.",
      proofs: [{ type: "Pratique", title: "Usage professionnel & académique", org: "Google Workspace", meta: ["Quotidien"], points: ["Rédaction collaborative, suivi de données sur Sheets, présentations Slides."] }],
      en: { title: "Google Suite", text: "Daily use of Google Workspace (Docs, Sheets, Slides, Drive, Gmail) for collaboration and productivity.", proofs: [{ type: "Practice", title: "Professional & Academic Use", org: "Google Workspace", meta: ["Daily"], points: ["Collaborative writing, data tracking on Sheets, Slides presentations."] }] },
    },
    "office-notion": {
      title: "Notion",
      text: "Organisation des projets, prise de notes structurée et gestion de bases de données de travail via Notion.",
      proofs: [{ type: "Pratique", title: "Gestion de projets & notes", org: "Notion", meta: ["Quotidien"], points: ["Planification de projets académiques et personnels, bases de données de contenus."] }],
      en: { title: "Notion", text: "Project organisation, structured note-taking and work database management via Notion.", proofs: [{ type: "Practice", title: "Project Management & Notes", org: "Notion", meta: ["Daily"], points: ["Planning academic and personal projects, content databases."] }] },
    },

    // ── Creative Tools ───────────────────────────────────────────────
    "creative-canva": {
      title: "Canva",
      text: "Création de visuels pour réseaux sociaux, affiches, présentations et supports marketing.",
      proofs: [
        {
          type: "Expérience",
          title: "Assistante Marketing",
          org: "Engoo",
          meta: ["Taipei · Taïwan", "10/2024 – 02/2025"],
          points: ["Création de templates et visuels A/B testés pour Xiaohongshu et Meta."],
          actions: [{ label: "Voir l'expérience", href: "#exp-engoo" }],
        },
        {
          type: "Activité",
          title: "Directrice Marketing – Club de Guzheng",
          org: "NCCU",
          meta: [],
          points: ["Affiches de recrutement, visuels d'événements et publications Facebook."],
          actions: [{ label: "Voir le portfolio", href: "#portfolio" }],
        },
      ],
      en: {
        title: "Canva",
        text: "Creating visuals for social media, posters, presentations and marketing materials.",
        proofs: [
          {
            type: "Experience",
            title: "Marketing Assistant",
            org: "Engoo",
            meta: ["Taipei · Taiwan", "10/2024 – 02/2025"],
            points: ["Designed and A/B tested visual templates for Xiaohongshu and Meta."],
            actions: [{ label: "View experience", href: "#exp-engoo" }],
          },
          {
            type: "Activity",
            title: "Marketing Director – Guzheng Club",
            org: "NCCU",
            meta: [],
            points: ["Recruitment posters, event visuals and Facebook posts."],
            actions: [{ label: "View portfolio", href: "#portfolio" }],
          },
        ],
      },
    },
    "creative-figma": {
      title: "Figma",
      text: "Maquettes, wireframes et prototypes d'interfaces pour projets de design.",
      proofs: [],
      en: {
        title: "Figma",
        text: "Wireframes, mockups and interface prototypes for design projects.",
        proofs: [],
      },
    },
    "creative-illustrator": {
      title: "Adobe Illustrator",
      text: "Création de visuels vectoriels : logos, icônes et illustrations pour supports imprimés et digitaux.",
      proofs: [],
      en: {
        title: "Adobe Illustrator",
        text: "Creating vector graphics: logos, icons and illustrations for print and digital media.",
        proofs: [],
      },
    },
    "creative-acrobat": {
      title: "Adobe Acrobat",
      text: "Édition, fusion et mise en forme de PDFs professionnels.",
      proofs: [],
      en: {
        title: "Adobe Acrobat",
        text: "Editing, merging and formatting professional PDF documents.",
        proofs: [],
      },
    },
    "creative-capcut": {
      title: "CapCut",
      text: "Montage vidéo court pour réseaux sociaux (Xiaohongshu, Instagram Reels, TikTok).",
      proofs: [
        {
          type: "Expérience",
          title: "Assistante Marketing",
          org: "Engoo",
          meta: ["Xiaohongshu"],
          points: ["Montage de vidéos courtes pour les campagnes de contenu."],
          actions: [{ label: "Voir l'expérience", href: "#exp-engoo" }],
        },
      ],
      en: {
        title: "CapCut",
        text: "Short-form video editing for social media (Xiaohongshu, Instagram Reels, TikTok).",
        proofs: [
          {
            type: "Experience",
            title: "Marketing Assistant",
            org: "Engoo",
            meta: ["Xiaohongshu"],
            points: ["Edited short-form videos for content campaigns."],
            actions: [{ label: "View experience", href: "#exp-engoo" }],
          },
        ],
      },
    },
    "creative-blender": {
      title: "Blender",
      text: "Modélisation 3D et rendu pour visuels créatifs et animations.",
      proofs: [],
      en: {
        title: "Blender",
        text: "3D modelling and rendering for creative visuals and animations.",
        proofs: [],
      },
    },

    // ── Office Suite ─────────────────────────────────────────────────
    "office-word": {
      title: "Microsoft Word",
      text: "Rédaction et mise en forme de documents professionnels : rapports, notes de synthèse et supports académiques.",
      proofs: [
        {
          type: "Expérience",
          title: "Assistante de recherche",
          org: "Institut des Relations Internationales (NCCU)",
          meta: ["Taipei · Taïwan", "06/2023 – 12/2023"],
          points: ["Rédaction de synthèses quantitatives et supports pour séminaires."],
          actions: [{ label: "Voir l'expérience", href: "#exp-research" }],
        },
      ],
      en: {
        title: "Microsoft Word",
        text: "Writing and formatting professional documents: reports, summaries and academic papers.",
        proofs: [
          {
            type: "Experience",
            title: "Research Assistant",
            org: "Institute of International Relations (NCCU)",
            meta: ["Taipei · Taiwan", "06/2023 – 12/2023"],
            points: ["Produced quantitative summaries and seminar materials."],
            actions: [{ label: "View experience", href: "#exp-research" }],
          },
        ],
      },
    },
    "office-powerpoint": {
      title: "Microsoft PowerPoint",
      text: "Création de présentations professionnelles et de supports de soutenance.",
      proofs: [
        {
          type: "Expérience",
          title: "Assistante d'enseignement",
          org: "College of Global Banking and Finance, NCCU",
          meta: ["Taipei · Taïwan"],
          points: ["Préparation de supports de cours et présentations de briefings."],
          actions: [{ label: "Voir l'expérience", href: "#exp-teaching" }],
        },
      ],
      en: {
        title: "Microsoft PowerPoint",
        text: "Creating professional presentations and pitch decks.",
        proofs: [
          {
            type: "Experience",
            title: "Teaching Assistant",
            org: "College of Global Banking and Finance, NCCU",
            meta: ["Taipei · Taiwan"],
            points: ["Prepared course materials and project briefing decks."],
            actions: [{ label: "View experience", href: "#exp-teaching" }],
          },
        ],
      },
    },
  };

  const previewContainer = document.querySelector(".skill-preview");
  const previewTitle = previewContainer?.querySelector(".skill-preview-title");
  const previewText = previewContainer?.querySelector(".skill-preview-text");
  const previewProofs = previewContainer?.querySelector(".skill-preview-proofs");

  function updateSkillPreview(key) {
    if (!previewContainer || !previewTitle || !previewText || !previewProofs)
      return;
    const baseData = skillData[key];
    if (!baseData) return;
    const activeLang = document.querySelector(".lang-btn.is-active")?.getAttribute("data-lang") || "fr";
    const pageCtx = document.body.classList.contains("page-finance") ? "finance"
                  : document.body.classList.contains("page-data")    ? "data"
                  : document.body.classList.contains("page-marketing") ? "marketing"
                  : "general";
    // Pick language layer, then page context on top
    const langOverride = activeLang !== "fr" ? baseData[activeLang] : null;
    const langData = langOverride ? { ...baseData, ...langOverride } : baseData;
    // byPage lives on the language-specific override when present, else on base
    const byPageSource = langOverride?.byPage ?? baseData.byPage;
    const pageLayer = byPageSource?.[pageCtx] ?? null;
    const data = pageLayer ? { ...langData, ...pageLayer } : langData;

    // Translate proof type labels for EN
    const typeMap = activeLang === "en" ? {
      "Cours": "Course", "Expérience": "Experience", "Certification": "Certification",
      "Portfolio": "Portfolio", "Activité": "Activity", "Pratique": "Practice",
      "Projet académique": "Academic Project", "Formation": "Education",
      "Bénévolat": "Volunteering", "Projet": "Project", "Certificat": "Certificate",
      "Lien": "Link", "Outil Personnel": "Personal Tool", "Preuve": "Proof",
    } : {};
    const actionMap = activeLang === "en" ? {
      "Voir l'expérience": "View experience", "Voir la formation": "View education",
      "Ouvrir le certificat": "Open certificate", "Voir le portfolio": "View portfolio",
      "Voir activités": "View activities", "Voir le rapport": "Read report",
      "Ouvrir": "Open", "Voir l'engagement": "View engagement",
    } : {};

    previewTitle.textContent = data.title;
    previewText.textContent = data.text;

    const proofs = Array.isArray(data.proofs)
      ? data.proofs
      : Array.isArray(data.links)
        ? data.links.map((l) => ({
            type: activeLang === "en" ? "Link" : "Lien",
            title: l.label,
            org: "",
            meta: [],
            points: [],
            actions: [{ label: activeLang === "en" ? "Open" : "Ouvrir", href: l.href }],
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
      const rawType = proof.type || "Preuve";
      type.textContent = typeMap[rawType] ?? rawType;

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
          link.textContent = actionMap[a.label] ?? a.label;
          actions.appendChild(link);
        });
        card.appendChild(actions);
      }

      previewProofs.appendChild(card);
    });

    // Render screenshots if defined for this skill
    const images = data.imagesByLang?.[activeLang] ?? data.imagesByLang?.fr ?? [];
    if (images.length) {
      const gallery = document.createElement("div");
      gallery.className = "proof-images";
      images.forEach(({ src, alt }) => {
        const a = document.createElement("a");
        a.href = src;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.className = "proof-img-link";
        const img = document.createElement("img");
        img.src = src;
        img.alt = alt;
        img.className = "proof-img";
        img.loading = "lazy";
        a.appendChild(img);
        gallery.appendChild(a);
      });
      previewProofs.appendChild(gallery);
    }
  }

  const skillChips = document.querySelectorAll(".skill-card[data-skill]");

  // Element-based selection: only the exact hovered/clicked chip is highlighted,
  // preventing duplicates when the same data-skill key appears in multiple blocks.
  function setActiveSkill(activeChipEl) {
    skillChips.forEach((c) => c.classList.toggle("is-skill-active", c === activeChipEl));
  }

  skillChips.forEach((chip) => {
    chip.addEventListener("mouseenter", () => {
      const key = chip.getAttribute("data-skill");
      if (key) {
        setActiveSkill(chip);
        updateSkillPreview(key);
      }
    });
  });

  // ── Shared filter animation helper ────────────────
  const FADE_DURATION = 190; // ms — must match CSS .filter-fade-out transition

  function animateFilterItem(el, show) {
    if (show) {
      // If currently hidden, reveal with fade-in animation
      if (el.style.display === "none" || el.hidden) {
        el.style.display = "";
        el.hidden = false;
        // Allow display change to paint before animating
        requestAnimationFrame(() => {
          el.classList.remove("filter-fade-out");
          el.classList.add("filter-fade-in");
          el.addEventListener(
            "animationend",
            () => el.classList.remove("filter-fade-in"),
            { once: true }
          );
        });
      }
    } else {
      // Fade out, then hide after transition
      el.classList.remove("filter-fade-in");
      el.classList.add("filter-fade-out");
      setTimeout(() => {
        // Only hide if still marked for fade-out (guard against rapid clicks)
        if (el.classList.contains("filter-fade-out")) {
          el.style.display = "none";
          el.classList.remove("filter-fade-out");
        }
      }, FADE_DURATION);
    }
  }

  // ── Reset preview to default placeholder ──────────
  function resetSkillPreview() {
    if (!previewContainer || !previewTitle || !previewText || !previewProofs) return;
    const lang = document.querySelector(".lang-btn.is-active")?.getAttribute("data-lang") || "fr";
    const dict = translations[lang];
    previewTitle.textContent = getTranslation(dict, "skills.previewTitle") || "Détail d'une compétence";
    previewText.textContent = getTranslation(dict, "skills.previewText") || "";
    previewProofs.innerHTML = "";
    skillChips.forEach((c) => c.classList.remove("is-skill-active"));
  }

  // Skill area filters (inside #skills)
  const skillsSection = document.getElementById("skills");
  const skillAreaFilters = skillsSection?.querySelectorAll("[data-skill-area]") || [];
  const skillsBlocks = skillsSection?.querySelectorAll(".skills-block[data-skill-area]") || [];

  function applySkillArea(area) {
    skillsBlocks.forEach((block) => {
      const blockArea = block.getAttribute("data-skill-area") || "all";
      const show = area === "all" || blockArea === area;
      animateFilterItem(block, show);
    });
  }

  if (skillsSection && skillAreaFilters.length) {
    skillAreaFilters.forEach((btn) => {
      btn.addEventListener("click", () => {
        const area = btn.getAttribute("data-skill-area") || "all";
        skillAreaFilters.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        applySkillArea(area);
        resetSkillPreview(); // ← clear preview when switching category
      });
    });

    applySkillArea("all");
    const initialChip = document.querySelector('.skill-card[data-skill="data-r"]');
    if (initialChip) { setActiveSkill(initialChip); updateSkillPreview("data-r"); }
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
      animateFilterItem(item, shouldShow);
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
      animateFilterItem(item, key === "all" || vibe === key);
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
              // Clear transition-delay after reveal so hover is instant
              entry.target.addEventListener("transitionend", () => {
                entry.target.style.transitionDelay = "";
              }, { once: true });
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -32px 0px" }
      );
      revealEls.forEach((el) => {
        const siblings = Array.from(el.parentElement?.children || []).filter(
          (c) => c.hasAttribute("data-reveal")
        );
        const idx = siblings.indexOf(el);
        // Cap stagger at 4 items (max 300 ms total delay)
        if (idx > 0) el.style.transitionDelay = Math.min(idx, 4) * 75 + "ms";
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
