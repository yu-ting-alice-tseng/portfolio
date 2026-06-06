document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = String(new Date().getFullYear());
  }

  // Fix corrupted PDF hrefs (encoding artifact from prior file operation)
  document.querySelectorAll('a[href*="250508_"]').forEach(a => {
    if (!a.href.includes("作品集")) {
      a.setAttribute("href", "assets/250508_作品集_社群經燳與設計_c.pdf");
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

  // Desktop nav dropdown ??click-toggle
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
        deepDiveMarketing: " – Page Marketing",
        deepDiveData: " – Page Data",
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
          "Étudiante en Master à emlyon business school, je combine une solide expertise analytique et une forte sensibilité pour le marketing stratégique et l'expérience client. Je souhaite mettre mes compétences au service de marques ambitieuses en digital, performance et développement de l'activité.",
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
          "Un socle structuré autour de l'analyse de données, du marketing digital et d'un profil international.",
        filterAll: "Tout",
        previewTitle: "Détail d'une compétence",
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
        subMkt1: "Référencement naturel (SEO)",
        subMkt2: "SEA (Search Engine Advertising)",
        subMkt3: "SMM (Social Media Marketing)",
        subMkt4: "Stratégie & Planification",
        subCons1: "Analyse Stratégique",
        subCons2: "Business & Présentation",
        subFin1: "Cours & Fondamentaux",
        subFin2: "Analyse & Contrôle de Gestion",
        subSoft1: "Collaboration",
        subSoft2: "Leadership & Organisation",
        subSoft3: "Communication",
        chipSeoTechnical: "SEO Technique",
        chipSeoKeyword: "Recherche De Mots-Clés & Stratégie De Contenu",
        chipSeoOnpage: "SEO On-Page",
        chipSeoOffpage: "SEO Off-Page",
        chipStatistics: "Statistiques & Méthodes Quantitatives",
        chipDesign: "Création de contenu & design visuel",
        chipResearch: "Études de marché & positionnement",
        chipCampaign: "Planification de campagnes",
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
          "Un parcours international entre la France et Taïwan, à l'interface du management, de la finance et des langues.",
        emlyon: {
          period: "09/2023 – Aujourd'hui",
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
          point1: "Certificate of Excellence (Top 5% GPA) – 2021, 2023.",
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
          title: "Programme d'ééchange en Science Politique",
          school: "Université Paris 1 Panthéon-Sorbonne",
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
        durationValue: "Personnalisable – 30 / 45 / 60 / 90 min selon vos besoins",
        materialsLabel: "Matériaux pédagogiques",
        materialsValue: "Supports créés par moi-même, ou matériaux choisis par l'élève – c'est vous qui décidez.",
        formatLabel: "Format",
        formatValue: "En ligne (Zoom / Google Meet)",
        langLabel: "Langues de cours",
        langValue: "Anglais · Français · Mandarin",
        responseLabel: "Réponse",
        responseValue: "Sous 24h via email ou Line",
        fieldName: "Votre prénom & nom",
        fieldNamePh: "Alice Martin",
        fieldContact: "Méthode de contact préférée",
        contactHint: "Laissez votre email ou votre ID Line – je vous répondrai sous 24h.",
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
        durCustom: "Autre durée – je précise dans le message",
        fieldMaterials: "Matériaux préférés",
        matTeacher: "Supports préparés par l'enseignante",
        matStudent: "Matériaux que j'apporte moi-même",
        matBoth: "Combinaison des deux",
        fieldSlot: "Créneaux préférés",
        fieldSlotPh: "Ex : lundi 18h – 0h, samedi matin",
        fieldMsg: "Message (facultatif)",
        fieldMsgPh: "Parlez-moi de votre niveau, vos objectifs ou vos questions.",
        submit: "Envoyer la demande",
        formNote: "Ce formulaire est une démonstration front-end. Connectez'e à Formspree ou Netlify Forms pour l'activer.",
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
        quizlet: "Flashcards et jeux de vocabulaire – idéal pour mémoriser des listes de mots.",
        tip1title: "Écoutez chaque jour",
        tip1: "Même 10 minutes de podcasts ou de YouTube en anglais améliore votre oreille plus vite qu'un manuel.",
        tip2title: "Écrivez, puis relisez",
        tip2: "Rédigez un court paragraphe chaque jour. Apportez-le en cours – nous le corrigerons ensemble.",
        tip3title: "Répétition espacée",
        tip3: "Révisez les nouveaux mots à intervalles croissants (1 jour – 3 jours – 1 semaine). Utilisez Quizlet ou Anki.",
        tip4title: "Parlez à voix haute",
        tip4: "Lisez des passages à voix haute, imitez des locuteurs natifs ou enregistrez-vous. L'aisance à l'oral s'améliore en parlant.",
        bbcYt: "Courtes vidéos sur la grammaire, le vocabulaire et la prononciation.",
        duncan: "Cours en direct en format long – idéal pour les apprenants intermédiaires.",
        ted: "Écoute avancée sur des sujets passionnants – utilisez la fonction transcription.",
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
        title2: "rigueur analytique et vision stratégique.",
        summary: "Étudiante en Master à emlyon business school avec un double parcours Économie/Gestion, je développe une expertise forte en modélisation, en gestion des risques et en résolution de problèmes complexes. Rigoureuse, analytique et dotée d'une solide maîtrise d'Excel et de la business intelligence, je structure les analyses pour accompagner la transformation et la création de valeur.",
        ctaPrimary: "Me contacter",
        ctaSecondary: "Voir mes expériences",
        cardRole: "Finance & Comptabilité",
        caseStudyLabel: "Expérience clé - Finance & Enseignement",
        caseStudyTitle: "Assistante d'enseignement - Finance & Risk Management",
        caseStudyDesc: "Support pédagogique pour les cours de finance et gestion des risques au College of Global Banking and Finance (NCCU). Accompagnement des étudiants, préparation de supports et coordination sur deux mandats.",
      },
      marketingHero: {
        kicker: "Marketing 360 - Activation - Contenu",
        title1: "Donner de l'impact aux marques, ",
        title2: "de la stratégie à l'activation.",
        summary: "Étudiante en Master à emlyon business school, je combine vision stratégique et exécution opérationnelle pour animer les marques. Forte d'expériences concrètes en marketing digital (réseau sociaux : +93% de vues ; campagnes publicitaires : +9,5% CTR, +5,1% CVR ) et d'une double culture franco-asiatique, je mets la créativité et l'analyse de données au service de la performance de vos campagnes.",
        ctaPrimary: "Voir mes créations",
        ctaSecondary: "Me contacter",
        cardRole: "Marketing 360",
        caseStudyLabel: "Étude de cas - Engoo XHS",
        caseStudyTitle: "Dashboard Analytics & Croissance Xiaohongshu",
        caseStudyS: "Situation : Engoo gérait son compte Xiaohongshu sans outil de mesure centralisé, rendant impossible la quantification de l'engagement et l'optimisation du ROI du contenu.",
        caseStudyA: "Action : Conception d'un dashboard Excel dynamique (Tableaux Croisés, Formules imbriquées) permettant une comparaison A/B automatique des périodes pour piloter la stratégie STP.",
        caseStudyR: "Résultat : Automatisation du reporting (gain de 5h/semaine) et croissance de 89% des interactions grâce à l'identification des formats visuels gagnants.",
        caseStudyInsight1: " – Les miniatures de type 'Educational Tips' génèrent un CTR 25% supérieur aux 'Life Hacks'.",
        caseStudyInsight2: " – Le 'Golden Time' de publication pour le segment cible se situe entre 19h et 21h.",
        caseStudyTemplate: "Consulter le modèle interactif (Excel)",
      },
      dataHero: {
        kicker: "Analyse de Données - Informatique Décisionnelle - Stratégie Commerciale",
        title1: "Des données brutes aux",
        title2: "insights actionnables.",
        summary: "Étudiante en Master à emlyon business school, je me passionne pour l'intersection entre les chiffres et la stratégie d'entreprise. Maîtrisant les outils d'analyse (Excel/TOSA 950, SQL, Power BI, Python), je transforme les données complexes en tableaux de bord actionnables pour optimiser les performances commerciales et piloter les décisions.",
        ctaPrimary: "Télécharger le dashboard (Excel)",
        ctaSecondary: "Voir mes expériences",
        cardRole: "Analyse de Données & Informatique Décisionnelle",
        caseStudyLabel: "Étude de cas - Dashboard XHS",
        caseStudyTitle: "Dashboard Excel - Performance Xiaohongshu",
        caseStudyDesc: "Construction d'un tableau de bord Excel complet pour suivre 12 métriques quotidiennes du compte Xiaohongshu d'Engoo : KPIs, évolution temporelle et comparaison A/B de périodes.",
      },
      portfolioTeaser: {
        label: "Portfolio",
        cta: "Explorer le portfolio →",
      },
      marketingPortfolioTeaser: {
        title: "Campagnes, dashboards & visuels de marque",
        desc: "Stratégies Xiaohongshu, analyses de performance et créations visuelles.",
      },
      financePortfolioTeaser: {
        title: "Analyses, modèles & études de cas",
        desc: "Modélisations financières, analyses de données et livrables conseil.",
      },
      dataPortfolioTeaser: {
        title: "Dashboards, visualisations & analyses de données",
        desc: "Tableaux de bord Excel, rapports Power BI et analyses quantitatives appliquées.",
      },
      indexPortfolioTeaser: {
        title: "Réalisations & projets concrets",
        desc: "Marketing, data, finance & enseignement — découvrez les projets par domaine.",
      },
      teachingHero: {
        kicker: "Langues & engagement international",
        title1: "Immersion linguistique &",
        title2: "échange interculturel",
        summary: "Locutrice native en mandarin, certifiée DALF C1 (français), IELTS 8.0 (anglais) et JLPT N1 (japonais). Engagée dans des programmes d'accompagnement linguistique et d'ééchange culturel à Taïwan.",
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
          dataPoint1: "Piloter un projet de recherche quantitative pour identifier les leviers de performance digitale et synthétiser les données en recommandations stratégiques pour l'ééquipe.",
          dataPoint2: "Concevoir et piloter des reportings de performance marketing (FB & Google) via des tableaux de bord – +9,5% CTR, +5,1% CVR.",
          dataPoint3: "Réaliser des benchmarks concurrentiels approfondis et suivre les KPIs (trafic, CTR, conversions) via Google Analytics & Search Console.",
          finTitle: "Assistante Marketing Digital (Stage)",
          finCompany: "KPN (Agence de marketing digital – SEO, SEM, publicité Facebook & Google)",
          finPoint1: "Gestion des budgets publicitaires mensuels sur Facebook et Google Ads, suivi des métriques ROI et allocation efficace du capital pour optimiser le coûtt par acquisition (taux de conversion +5,1%).",
          finPoint2: "Réalisation d'audits de performance mensuels sur les sites web, analyse des écarts clés et collaboration avec les équipes transverses pour identifier et résoudre les problèmes.",
        },
        engoo: {
          period: "10/2024 – 02/2025",
          title: "Assistante Marketing",
          point1: "Stratégie de contenu Xiaohongshu basée sur le modèle STP et A/B testing – +89.1% d'interactions et +69.7% d'abonnés en 3 mois.",
          point2: "Veille concurrentielle, analyse d'audience et adaptation des visuels par sous-segment cible.",
          point3: "Création de contenus Meta (Facebook & Instagram) alignés avec les tendances et la marque.",
          dataPoint1: "Construire un dashboard Excel dynamique – 12 métriques quotidiennes, comparaison A/B automatisée et visualisation des KPIs – réduisant le temps de reporting de 5h/semaine.",
          dataPoint2: "Réaliser des analyses de marché approfondies et une veille concurrentielle pour optimiser la stratégie de contenu sur le segment du chinois simplifié (REDnote / Xiaohongshu).",
          dataPoint3: "Déployer une stratégie de contenu data-driven fondée sur le modèle STP – +93,3% de vues, +89,1% d'interactions et +69,7% d'abonnés en 3 mois.",
          finTitle: "Assistante Marketing (Stage)",
          finCompany: "Engoo, DMM.com (Plateforme internationale de cours de langue en ligne)",
          finPoint1: "Analyse de marché approfondie pour développer et affiner les stratégies marketing sur le segment du chinois simplifié.",
          finPoint2: "Gestion des métriques de performance et de contenu sur Xiaohongshu – +93,3% de vues, +89,1% d'interactions et +69,7% d'abonnés en 3 mois.",
          pythonPoint: "Développement d'un script Python d'automatisation de la consolidation de données quotidiennes, améliorant l'efficacité du processus de reporting chaque jour.",
          portfolioLink: "Voir les créations (PDF)",
          excelLink: "Télécharger le tableau de bord XHS (Excel)",
          excelHref: "assets/Engoo_XHS Dashboard_FR.xlsx",
          stat1: "Vues",
          stat2: "Abonnés",
          stat3: "Interactions",
          screenshot1: "assets/Excel_Engoo/Engoo Dashboard_FR.png",
          screenshot2: "assets/Excel_Engoo/Engoo Data_FR.png",
          screenshotAlt1: "Tableau de bord de performance – Engoo XHS",
          screenshotAlt2: "Données brutes – Engoo XHS",
          showcaseLabel: "Livrables - Dashboard XHS",
          showcaseBadge1: "- Évaluation générale",
          showcaseTitle1: "Vue d'ensemble - 30 derniers jours",
          showcaseDesc1: "Section gauche : KPIs principaux (vues, abonnés, engagement, notoriété) et graphiques d'évolution sur la période sélectionnée.",
          showcaseBadge2: "⚖️ Comparaison A/B",
          showcaseTitle2: "30 jours vs 30 jours précédents",
          showcaseDesc2: "Section droite : courbe Période A vs Période B pour identifier les tendances et l'impact des actions menées.",
          showcaseBadge3: "- Données brutes",
          showcaseTitle3: "Jeu de données quotidiennes",
          showcaseDesc3: "12 métriques par jour (vues, temps de visionnage, engagement, notoriété – – base structurée de toutes les visualisations.",
        },
        teaching: {
          period: "07/2023 – 12/2023 · 07/2024 – 04/2025",
          title: "Assistante d'enseignement",
          point1: "Support de cours (finance, risk management) et suivi des étudiants.",
          point2: "Préparation de supports et coordination logistique.",
          dataSupport: "Support pédagogique pour les cours de programmation et analyse de données (VBA, Access).",
          dataCoord: "Coordonner la logistique opérationnelle de 9 cours et assurer l'interface entre des parties prenantes exigeantes.",
          finTitle: "Assistante de cours",
          finCompany: "Faculté de Banque et Finance Internationale, NCCU",
          finPoint1: "Coordination logistique de 9 cours de finance, en assurant l'interface entre les étudiants, les enseignants et les partenaires entreprise.",
          finPoint2: "Animation d'éénénements de networking et de briefings, dans le respect des réglementations universitaires et gestion de plannings multi-parties prenantes sous contrainte de temps.",
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
          desc: "Reprise et développement du compte Xiaohongshu d'Engoo sur le marché chinois simplifié. Stratégie de contenu fondée sur le modèle STP, A/B testing des visuels et des textes, ciblage de sous-segments selon leur profil.",
          stat1: "Vues",
          stat2: "Abonnés",
          stat3: "Interactions",
        },
        guzheng: {
          tag: "Community Management",
          title: "政大古箏社 – Page Facebook",
          desc: "Gestion de la page Facebook du club de guzheng de NCCU. Création de visuels pour les annonces d'activités, recrutement de nouveaux membres et couverture d'éénénements de fin d'année.",
        },
        instagram: {
          tag: "Content Creation",
          title: "Compte lectures personnelles",
          desc: "Création de contenus visuels et rédactionnels pour un compte Instagram dédié aux comptes rendus de lecture. Narration visuelle originale et analyse littéraire accessible – ex. Des fleurs pour Algernon.",
        },
        design: {
          tag: "Photographie & Design",
          title: "Photographie & supports promotionnels",
          desc: "Photographie de paysages, portraits et architecture – recherche d'angles et d'ééléments inattendus. Création de supports de communication pour événements : badges, affiches, publications pour le club de kyudo et d'autres activités.",
        },
        packaging: {
          title: "'包裝設計競賽 – 18th Penwards",
          desc: "Participation à la 18e édition du concours de design d'emballage Penwards (2024). Création de visuels promotionnels pour l'appel à participation.",
        },
        insightLbl: "Insights métier",
        mkt: {
          heroTitle2: "& Design créatif",
          heroEyebrow: "Yu-Ting Tseng · Projets sélectionnés · 2024 – 2025",
          heroDesc: "Campagnes data-driven, direction artistique et community management — des projets où créativité visuelle et analyse de performance se croisent.",
          heroStatProjets: "Projets",
          heroStatGrowth: "Croissance XHS",
          heroStatPart: "Participants AIESEC",
          filterAll: "Tous",          filterAll: "Tous",
          filterDashboard: "Dashboard & Data",
          filterCampagne: "Campagnes",
          filterDesign: "Design visuel",
          filterCommunity: "Community",
          engoo: {
            num: "01 - Étude de cas complète",
            tag: "Dashboard Excel - Social Analytics - A/B Testing",
            sitLbl: "Situation - Contexte & Défi",
            actLbl: "Action - Construction du dashboard",
            resLbl: "Résultats - Impact sur 3 mois",
            statMet: "Métriques / jour",
            statVues: "Vues - 3 mois",
            statInter: "Interactions",
            statAb: "Module A/B dynamique",
          },
          aiesec: {
            num: "02 - Campagne Marketing",
            tag: "Campagne - Direction artistique",
            body: "Pilotage de l'équipe marketing (4 personnes) pour le camp international YOLO d'IESEC in NCCU. Conception des visuels de campagne - affiches et publications - pour le recrutement de volontaires et de participants.",
            statVol: "Volontaires recrutés",
            statPart: "Participants",
            statBudget: "Objectif budgétaire dépassé",
          },
          guzhengNum: "03 - Community Management",
          penwardsNum: "04 - Design Visuel",
          penwardsTag: "Design - Concours",
          footerBack: "←Retour à Marketing",
          footerNext: "Portfolio Data & Recherche →",
        },
        data: {
          heroTitle1: "Data &",
          heroTitle2: "Recherche de marché",
          heroEyebrow: "Yu-Ting Tseng · Data & Recherche de marché",
          heroDesc: "Tableaux de bord Excel, analyses quantitatives et études de marché – la rigueur analytique au service de décisions actionnables.",
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
            subtitle: "Étude empirique (2000 – 024) · 3 hypothèses · Données : LSEG Workspace / Refinitiv, WGI, POLCON III, FSI",
            sitLbl: "Situation",
            actLbl: "Méthodologie",
            resLbl: "Résultats clés",
            statHypo: "Hypothèses testées",
            statPeriod: "Période analysée",
            statIndices: "Indices politiques",
            btn: "Lire le rapport complet (PDF)",
          },
          footerBack: "←Portfolio Marketing",
          footerNext: "Portfolio Finance →",
        },
        fin: {
          heroTitle1: "Finance &",
          heroTitle2: "Analyse",
          heroEyebrow: "Yu-Ting Tseng · Finance & Analyse Quantitative",
          heroDesc: "Recherche académique en finance quantitative et modélisation empirique – rigueur analytique et insights actionnables pour les décisions d'investissement.",
          heroStatProj: "Projet",
          heroStatData: "Données M&A",
          heroStatHypo: "Hypothèses testées",
          filterAll: "Tous",
          filterAnalyse: "Analyse",
          filterRecherche: "Recherche",
          filterDistinction: "Distinctions",
          ma: {
            num: "01 · Recherche empirique · Finance quantitative",
            subtitle: "Étude empirique (2000 – 024) · 3 hypothèses · Données : LSEG Workspace / Refinitiv, WGI, POLCON III, FSI",
            sitLbl: "Situation",
            actLbl: "Méthodologie",
            resLbl: "Résultats clés",
            statHypo: "Hypothèses testées",
            statPeriod: "Période analysée",
            statIndices: "Indices politiques",
            btn: "Lire le rapport complet (PDF)",
          },
          footerBack: "←Portfolio Data & Recherche",
          footerNext: "Accueil →",
        },
      },
      projects: {
        title: "Projets sélectionnés",
        subtitle:
          "Quelques projets académiques ou personnels illustrant ma manière de travailler et mes centres d'intérêt.",
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
          title: "Co-fondatrice – Sora Education (camps de jeunesse)",
          text:
            "Organisation de cinq camps d'été d'une semaine avec deux partenaires, élaboration du business plan, suivi financier et études de marché pour ajuster l'offre de cours et la stratégie marketing.",
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
          title: "Bénévole – Restos du C'ur",
          org: "Les Restos du C'ur · Association humanitaire",
          point1: "Distribution alimentaire et accueil de bénéficiaires en situation de précarité.",
          point2: "Tri et conditionnement des denrées alimentaires.",
        },
      },
      volunteer: {
        title: "Bénévolat & Engagement",
        subtitle:
          "Des initiatives centrées sur l'ééducation, l'international et l'impact social.",
        aiesec: {
          period: "09/2024 – Présent",
          title: "Membre – AIESEC in NCCU",
          org:
            "AIESEC · Organisation internationale de développement du leadership",
          point1:
            "Pilotage d'une équipe marketing de 4 personnes pour recruter 15 volontaires et plus de 60 participants à un camp d'anglais, au-delà de l'objectif budgétaire.",
          point2:
            "Collaboration avec des partenaires locaux et internationaux sur des programmes de volontariat.",
          stat1: "Volontaires recrutés",
          stat2: "Participants",
          stat3: "Objectif dépassé",
          finTitle: "Membre",
          finOrg: "AIESEC in NCCU (Organisation mondiale à but non lucratif de coordination de programmes de volontariat international)",
          finPoint1: "Gestion du budget et des prévisions financières d'un camp d'été, optimisation des structures de coûtts pour dépasser l'objectif de budget équilibré de 53,7%.",
        },
        usr: {
          period: "09/2024 – Présent",
          title: "Volontaire – Projet University Social Responsibility",
          org: "NCCU · Office of University Responsibility",
          point1:
            "Accompagnement d'éélèves issus de familles transnationales dans l'apprentissage de la langue et l'intégration culturelle.",
        },
        flagship: {
          period: "09/2023 – Présent",
          title: "Volontaire – Programme de compagnonnage linguistique",
          org: "Chinese Overseas Flagship Center in Taiwan",
          point1:
            "Facilitation de l'immersion linguistique et culturelle d'éétudiants américains via des événements et visites.",
        },
        buddy: {
          period: "09/2023 – 01/2025",
          title: "Étudiante'éférente – Buddy Program",
          org: "NCCU · Office of International Cooperation",
          point1:
            "Accompagnement de trois étudiants en échange (France, États-Unis, Corée du Sud) dans leur vie quotidienne à Taïwan.",
        },
        nuit: {
          period: "12/2023",
          title: "Déléguée – Nuit des Idées (français'andarin)",
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
          title: "Bourse d'ééchange",
          org: "Ministère de l'é'ucation (Taïwan)",
          text:
            "Bourse au mérite pour un programme d'ééchange international en France.",
          year: "2024",
        },
        short: {
          title: "Bourse d'éétudes à court terme",
          org: "NCCU – Université Nationale Chengchi",
          text:
            "Financement au mérite pour un séjour d'éétudes à l'éétranger.",
          year: "2024",
        },
        excellence: {
          title: "Certificate of Excellence – Top 5% GPA",
          org: "NCCU – Université Nationale Chengchi",
          text:
            "Récompense académique pour des résultats parmi les 7 % meilleurs étudiants de NCCU.",
          year: "2021, 2023",
        },
      },
      contact: {
        heading: "Entrons en contact",
        intro:
          "Intéressé·e par un stage, un projet ou une collaboration ? Envoyez-moi un message, je vous répondrai avec plaisir.",
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
          "Ce formulaire est une démonstration front-end. Connectez'e à Formspree ou Netlify Forms pour l'activer.",
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
        deepDiveMarketing: " – Marketing page",
        deepDiveData: " – Data page",
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
          "Master's student at emlyon business school with strong analytical skills and a passion for digital marketing and customer experience. I aim to support ambitious brands in performance marketing and business development.",
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
        subMkt1: "SEO (Search Engine Optimization)",
        subMkt2: "SEA (Search Engine Advertising)",
        subMkt3: "SMM (Social Media Marketing)",
        subMkt4: "Strategy & Planning",
        subCons1: "Strategic Analysis",
        subCons2: "Business & Presentations",
        subFin1: "Courses & Fundamentals",
        subFin2: "Analysis & Management Accounting",
        subSoft1: "Collaboration",
        subSoft2: "Leadership & Organisation",
        subSoft3: "Communication",
        chipSeoTechnical: "Technical SEO",
        chipSeoKeyword: "Keyword Research & Content Strategy",
        chipSeoOnpage: "On-Page SEO",
        chipSeoOffpage: "Off-Page SEO",
        chipStatistics: "Statistics & Quantitative Methods",
        chipDesign: "Content creation & visual design",
        chipResearch: "Market research & positioning",
        chipCampaign: "Campaign planning",
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
          point1: "Certificate of Excellence (Top 5% GPA) – 2021, 2023.",
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
          school: "Université Paris 1 Panthéon-Sorbonne",
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
        durationValue: "Fully customisable – 30 / 45 / 60 / 90 min, whatever works for you",
        materialsLabel: "Teaching Materials",
        materialsValue: "My own self-made materials, or materials you bring – your choice.",
        formatLabel: "Format",
        formatValue: "Online (Zoom / Google Meet)",
        langLabel: "Teaching languages",
        langValue: "English · French · Mandarin",
        responseLabel: "Response time",
        responseValue: "Within 24 h via email or Line",
        fieldName: "Your full name",
        fieldNamePh: "Alice Martin",
        fieldContact: "Preferred contact method",
        contactHint: "Leave your email or Line ID – I'll reply within 24 h.",
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
        durCustom: "Other – I'll specify in the message",
        fieldMaterials: "Teaching materials",
        matTeacher: "Self-made materials prepared by the teacher",
        matStudent: "Materials I bring myself",
        matBoth: "A mix of both",
        fieldSlot: "Preferred time slots",
        fieldSlotPh: "e.g. Monday 6 – pm, Saturday morning",
        fieldMsg: "Message (optional)",
        fieldMsgPh: "Tell me about your level, goals or any questions.",
        submit: "Send request",
        formNote: "This is a front-end demo form. Connect it to Formspree or Netlify Forms to activate it.",
      },
      resources: {
        title: "Learning Resources",
        subtitle: "Free resources to practise English, French or Mandarin between lessons.",
        tabEn: "'' English",
        tabFr: "'' French",
        tabZh: "🇨🇳 Mandarin",
        websitesTitle: "Websites & Apps",
        tipsTitle: "Study Tips",
        videosTitle: "Video Resources",
        bbc: "Free lessons, videos and quizzes at every level.",
        cambridge: "Official practice materials for Cambridge exams.",
        ieltsOfficial: "Free sample papers and preparation guides from the IELTS organisation.",
        quizlet: "Flashcards and vocabulary games – great for memorising word lists.",
        tip1title: "Listen every day",
        tip1: "Even 10 minutes of English podcasts or YouTube builds your ear for natural speech faster than any textbook.",
        tip2title: "Write, then review",
        tip2: "Write a short paragraph daily on any topic. Bring it to class – we will review it together.",
        tip3title: "Spaced repetition",
        tip3: "Review new vocabulary at increasing intervals (1 day – 3 days – 1 week). Use Quizlet or Anki to automate this.",
        tip4title: "Speak out loud",
        tip4: "Read passages aloud, shadow native speakers or record yourself. Speaking fluency only improves by speaking.",
        bbcYt: "Short, entertaining clips on grammar, vocabulary and pronunciation.",
        duncan: "Long-form live lessons – ideal for intermediate learners who want real conversation.",
        ted: "Advanced listening practice on fascinating topics – use the transcript feature.",
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
        summary: "Master's student at emlyon business school with a strong background in Economics and Management, I am dedicated to financial modeling, risk analysis, and complex problem-solving. Rigorous and highly analytical, I leverage tools like Excel and business intelligence to deliver structured insights that support business transformation and value creation.",
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
        title2: "real growth.",
        summary: "Master's student at emlyon business school, I led Xiaohongshu campaigns for Engoo (+93% views, +89% interactions in 3 months). I blend creativity, data and brand sense to grow communities and drive performance.",
        ctaPrimary: "View my portfolio",
        ctaSecondary: "Contact me",
        cardRole: "Digital Marketing & Content Creation",
        caseStudyLabel: "Case Study · Engoo Xiaohongshu",
        caseStudyTitle: "Analytics Dashboard & Xiaohongshu Growth",
        caseStudyS: "Situation: Engoo lacked a centralized tool to track Xiaohongshu performance, making it difficult to quantify engagement and optimize content ROI.",
        caseStudyA: "Action: Developed a dynamic Excel dashboard (Pivot Tables, Nested Formulas) featuring automated A/B period comparison to drive the STP strategy.",
        caseStudyR: "Result: Automated reporting saved 5h/week and led to an 89% interaction increase by identifying winning visual styles.",
        caseStudyInsight1: " – 'Educational Tips' thumbnails deliver a 25% higher CTR than 'Life Hacks' style.",
        caseStudyInsight2: " – The optimal posting 'Golden Time' for the target segment is 7:00 PM – 9:00 PM.",
        caseStudyTemplate: "View Interactive Excel Template",
      },
      dataHero: {
        kicker: "Data analysis · Market research · Quantitative methods",
        title1: "From raw data to",
        title2: "strategic insights.",
        summary: "Master's student at emlyon business school, I turn complex datasets into actionable decisions. Proficient in R, Python, SQL, Excel (TOSA 950/1000), Power BI and Tableau – applied to market research and performance analytics.",
        ctaPrimary: "Download dashboard (Excel)",
        ctaSecondary: "View my experience",
        cardRole: "Data Analysis & Market Research",
        caseStudyLabel: "Case Study · XHS Dashboard",
        caseStudyTitle: "Excel Dashboard – Xiaohongshu Performance",
        caseStudyDesc: "Built a comprehensive Excel dashboard to track 12 daily metrics for Engoo's Xiaohongshu account: KPIs overview, time-series trends and A/B period comparison.",
      },
      portfolioTeaser: {
        label: "Portfolio",
        cta: "Explore the portfolio →",
      },
      marketingPortfolioTeaser: {
        title: "Campaigns, dashboards & brand visuals",
        desc: "Xiaohongshu strategies, performance analytics and visual creations.",
      },
      financePortfolioTeaser: {
        title: "Analyses, models & case studies",
        desc: "Financial modelling, data analysis and consulting deliverables.",
      },
      dataPortfolioTeaser: {
        title: "Dashboards, visualisations & data analyses",
        desc: "Excel dashboards, Power BI reports and applied quantitative analyses.",
      },
      indexPortfolioTeaser: {
        title: "Projects & concrete achievements",
        desc: "Marketing, data, finance & teaching — explore projects by domain.",
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
          dataPoint2: "Designed and managed marketing performance dashboards (FB & Google) – +9.5% CTR, +5.1% CVR.",
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
          dataPoint1: "Built a dynamic Excel dashboard – 12 daily metrics, automated A/B comparison and KPI visualisation – cutting reporting time by 5h/week.",
          dataPoint2: "Conducted in-depth market analyses and competitive monitoring to optimise the content strategy for the simplified Chinese market (REDnote / Xiaohongshu).",
          dataPoint3: "Deployed a data-driven content strategy based on the STP model – +93.3% views, +89.1% interactions and +69.7% followers in 3 months.",
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
          screenshot1: "assets/Excel_Engoo/Engoo Dashboard_EN.png",
          screenshot2: "assets/Excel_Engoo/Engoo Data_EN.png",
          screenshotAlt1: "Performance Dashboard – Engoo XHS",
          screenshotAlt2: "Raw Data – Engoo XHS",
          showcaseLabel: "Work output · XHS Dashboard",
          showcaseBadge1: " – General Performance",
          showcaseTitle1: "Overview · Last 30 Days",
          showcaseDesc1: "Left panel: core KPIs (views, followers, engagement, brand awareness) and trend charts for the selected period.",
          showcaseBadge2: "⚖️ A/B Comparison",
          showcaseTitle2: "Last 30 Days vs Previous 30",
          showcaseDesc2: "Right panel: Period A vs Period B trend curve to identify growth patterns and the impact of content actions.",
          showcaseBadge3: " – Raw Data",
          showcaseTitle3: "Daily Dataset",
          showcaseDesc3: "12 metrics per day (views, watch time, engagement, brand awareness – – the structured foundation of all visualisations.",
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
          heroTitle2: "& Creative Design",
          heroEyebrow: "Yu-Ting Tseng · Selected Projects · 2024 – 025",
          heroDesc: "Data-driven campaigns, art direction and community management – projects where visual creativity meets performance analytics.",
          heroStatProjets: "Projects",
          heroStatGrowth: "XHS Growth",
          heroStatPart: "AIESEC Participants",
          filterAll: "All",
          filterDashboard: "Dashboard & Data",
          filterCampagne: "Campaigns",
          filterDesign: "Visual Design",
          filterCommunity: "Community",
          engoo: {
            num: "01 - Full Case Study",
            tag: "Excel Dashboard - Social Analytics - A/B Testing",
            sitLbl: "Situation - Context & Challenge",
            actLbl: "Action - Dashboard Architecture",
            resLbl: "Results - 3-Month Impact",
            statMet: "Metrics / day",
            statVues: "Views - 3 months",
            statInter: "Interactions",
            statAb: "Dynamic A/B Module",
          },
          aiesec: {
            num: "02 - Marketing Campaign",
            tag: "Campaign - Art Direction",
            body: "Led the 4-person marketing team for AIESEC in NCCU's YOLO international camp. Designed the main campaign visuals - posters and social posts - to drive volunteer and participant recruitment.",
            statVol: "Volunteers recruited",
            statPart: "Participants",
            statBudget: "Budget target exceeded",
          },
          guzhengNum: "03 - Community Management",
          penwardsNum: "04 - Visual Design",
          penwardsTag: "Design - Competition",
          footerBack: "←Back to Marketing",
          footerNext: "Data & Research Portfolio →",
        },
        data: {
          heroTitle1: "Data &",
          heroTitle2: "Market Research",
          heroEyebrow: "Yu-Ting Tseng · Data & Market Research",
          heroDesc: "Excel dashboards, quantitative analyses and market research – analytical rigour in service of actionable business decisions.",
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
            subtitle: "Empirical study (2000 – 024) · 3 hypotheses · Data: LSEG Workspace / Refinitiv, WGI, POLCON III, FSI",
            sitLbl: "Situation",
            actLbl: "Methodology",
            resLbl: "Key Findings",
            statHypo: "Hypotheses tested",
            statPeriod: "Period analysed",
            statIndices: "Political indices",
            btn: "Read the full paper (PDF)",
          },
          footerBack: "←Marketing Portfolio",
          footerNext: "Finance Portfolio →",
        },
        fin: {
          heroTitle1: "Finance &",
          heroTitle2: "Analysis",
          heroEyebrow: "Yu-Ting Tseng · Finance & Quantitative Analysis",
          heroDesc: "Academic research in quantitative finance and empirical modelling – rigorous analysis producing actionable investment insights.",
          heroStatProj: "Project",
          heroStatData: "M&A Data",
          heroStatHypo: "Hypotheses tested",
          filterAll: "All",
          filterAnalyse: "Analysis",
          filterRecherche: "Research",
          filterDistinction: "Awards",
          ma: {
            num: "01 · Empirical Research · Quantitative Finance",
            subtitle: "Empirical study (2000 – 024) · 3 hypotheses · Data: LSEG Workspace / Refinitiv, WGI, POLCON III, FSI",
            sitLbl: "Situation",
            actLbl: "Methodology",
            resLbl: "Key Findings",
            statHypo: "Hypotheses tested",
            statPeriod: "Period analysed",
            statIndices: "Political indices",
            btn: "Read the full paper (PDF)",
          },
          footerBack: "←Data & Research Portfolio",
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
          title: "Co-Founder – Sora Education (Youth Camps)",
          text:
            "Co'an five week'ong summer camps with two partners, built the business plan, managed finances and conducted market research to refine course design and marketing strategy.",
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
          title: "Volunteer – Restos du C'ur",
          org: "Les Restos du C'ur · Humanitarian association",
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
            "AIESEC · Global non-profit organization developing youth leadership",
          point1:
            "Led a marketing team of four to recruit 15 volunteers and over 60 participants for an English camp, exceeding the balanced-budget target by 53.7%.",
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
            "Supported American students – language and cultural immersion through events and tours.",
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
          title: "Delegate – Nuit des Idées (French'andarin debates)",
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
          title: "Short-term Study Abroad Scholarship",
          org: "NCCU – National Chengchi University",
          text: "Funding for short'erm study abroad based on academic excellence.",
          year: "2024",
        },
        excellence: {
          title: "Certificate of Excellence – Top 5% GPA",
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
      brandName: "?暸?摨?Yu?ing Tseng",
      a11y: { skipLink: "頝唾?批捆" },
      simpleNav: {
        resume: "撅交風",
        viewPortfolioPdf: "雿???PDF嚗?",
        langMandarin: "銝剜?嚗?店嚗?",
        langMandarinCert: "瘥?",
        langFrench: "瘜?",
        langEnglish: "?梯?",
        langJapanese: "?亥?",
        deepDiveMarketing: "??銵撠?",
        deepDiveData: "???豢?撠?",
        deepDiveLabel: "???底蝝圈??ｇ?",
        aiesecDesc: "撣園??犖銵撠?嚗?鞎?AIESEC YOLO ??敹極????摰?嚗ˊ雿蜓閬死?暑?絲?梧?頞?摰????格???",
        kpnDesc: "?瑁? SEO ?芸??? Google Analytics 餈質馱 KPI嚗??TR????嚗?銝阡脰? SEA 撱?????勗???",
        footerExtra: "?訾?銵 · ?豢??? · 憿批?",
      },
      nav: {
        about: "???",
        skills: "??賢???",
        education: "摮豢風?",
        experience: "撖衣??極雿?",
        portfolio: "雿???",
        extracurricular: "隤脣?瘣餃???撌?",
        volunteer: "敹極??撠?",
        honors: "?飛??璁株亳",
        projects: "撠?雿?",
        contact: "?舐窗?孵?",
        teaching: {
          languages: "隤??賢?",
          services: "?飛??",
          expTeaching: "?飛蝬風",
          engagement: "????",
        },
      },
      hero: {
        kicker: "?訾?銵 · ?豢???",
        title1: "???豢?頧???",
        title2: "銵瘙箇?",
        summary:
          "?桀?撠梯? emlyon ?飛?Ｙ恣?飛蝣拙ㄚ嚗??雓寧?鞈????賢????訾?銵????撽??望?嚗????拙??撅雿??瑁?璆剖????",
        locationLabel: "?曉?",
        locationValue: "瘜???",
        availabilityLabel: "?舫?憪???",
        availabilityValue: "2026 撟?7 ??2027 撟?1 ??6 ??隡飛撖衣?嚗?",
        ctaPrimary: "?舐窗??",
        ctaSecondary: "?亦???蝬風",
        cardName: "?暸?摨?Yu?ing Tseng",
        cardRole: "?訾?銵??????",
        cardEmailLabel: "?餃??萎辣",
        cardPhoneLabel: "?餉店",
        cardLanguagesLabel: "隤??賢?",
      },
      skills: {
        title: "??賢???",
        subtitle: "蝯??批????瑟?撖?頝冽??????賢??嗆???",
        filterAll: "?券",
        previewTitle: "??質底??",
        previewText: "撠?曌宏?單??賣?蝐歹??亦??賊?雿?嚗?獢玨蝔?甇瘀????牧??",
        chipEnglish: "?梯? ??IELTS 8.0 (C1)",
        chipFrench: "瘜? ??DALF C1",
        chipJapanese: "?交隤???JLPT N1",
        chipMandarin: "銝剜?",
        chipMandarinNative: "銝剜? ??瘥?",
        filterData: "?豢???",
        filterMarketing: "銵",
        filterConsulting: "憿批?蝑",
        filterFinance: "鞎∪???",
        filterSoft: "頠祕??",
        filterLanguages: "隤?",
        blockData: "?豢???",
        blockMarketing: "?訾?銵",
        blockConsulting: "憿批?蝑",
        blockFinance: "鞎∪???",
        blockSoft: "頠祕??",
        blockLanguages: "隤?",
        subData1: "蝔?隤?",
        subDataTools: "撌亙???函?撘?",
        subData2: "?豢?閬死??",
        subData3: "???寞?",
        subDataQuant: "???寞?",
        subDataQual: "鞈芸??寞?????",
        subData4: "AI 撌亙",
        subMkt1: "撱???",
        subMkt2: "蝷曄黎慦??摰?",
        subMkt3: "蝑閬?",
        subCons1: "蝑??",
        subCons2: "?平??",
        subFin1: "隤脩??蝷?",
        subSoft1: "頝冽???雿?",
        subSoft2: "????蝜?",
        subSoft3: "皞?",
        chipStatistics: "蝯梯????瘜?",
        chipDesign: "?批捆?萎???閬箄身閮?",
        chipResearch: "撣隤輻???雿?",
        chipCampaign: "銵瘣餃?閬?",
        chipIntercultural: "頝冽???雿?",
        chipLeadership: "?????恣??",
        chipProject: "撠?蝞∠???蝜?",
        chipComm: "皞??祉瞍?",
        chipAiTools: "AI 撌亙嚗hatGPT?laude?emini嚗?",
        chipAiAds: "AI 頛撱??",
        chipAiBusiness: "AI ?平?",
        subFin2: "???恣??閮?",
        blockAI: "AI 撌亙",
        blockOffice: "颲血頠?",
        blockCreative: "?菜?撌亙",
        chipChatGPT: "ChatGPT",
        chipClaude: "Claude",
        chipGemini: "Gemini",
        chipVibeCoding: "Vibe Coding",
        chipMicrosoftOffice: "Microsoft Office嚗ord · Excel · PowerPoint嚗?",
        chipGoogleSuite: "Google Suite",
        chipNotion: "Notion",
        subCreativeGraphic: "撟喲閮剛?",
        subCreativeVideo: "敶梁??芾摩",
        filterAI: "AI ?雿?",
        filterOffice: "颲血頠?",
        blockDataMarketing: "銵?豢?",
        subtitleMarketing: "?訾?銵?摰孵雿?極?瑁? AI 銵???",
        subtitleData: "蝔?隤??極?瑯??瘜?撣?弦??",
        subtitleFinance: "??撌亙?瓷?蝷?蝑??賬?",
      },
      tags: {
        visualDesign: "閬死閮剛?",
        competition: "蝡嗉魚",
        teaching: "?飛",
        online: "蝺?",
        translation: "蝧餉陌",
        proofreading: "?∠阮",
        language: "隤?",
        mentoring: "撠葦",
        immersion: "隤?瘝絡",
        intercultural: "頝冽???",
        exchange: "鈭斗?",
        speaking: "?祉瞍?",
        bilingual: "??",
        volunteer: "敹極",
        social: "蝷暹?敶梢",
        entrepreneurship: "?菜平",
        strategy: "蝑",
        leadership: "????",
        marketing: "銵",
        clubs: "蝷曉?",
        culture: "??",
        data: "?豢?",
        research: "?弦",
      },
      locations: {
        online: "蝺? · ?啁",
      },
      education: {
        title: "摮豢風?",
        subtitle: "?冽????啁銋?嚗??恣????隤?????擗???",
        emlyon: {
          period: "2023/09 ???喃?",
          title: "蝞∠?摮貊◣憯恬?Grande ?cole 閮嚗?",
          school: "emlyon business school",
          point1: "銝颱耨????閮?",
          pointEn: "?刻隤?隤脰玨蝔?",
          gpa: "4.0/4.0",
          specLabel: "撠平?孵?",
          spec1: "鞎∪???閮?",
        },
        nccu: {
          period: "2020/09 ??2025/06",
          title: "甇散隤?摮貊頂瘜?蝯?鈭文飛蝟駁?銝颱耨嚗?瞈頂頛頂",
          school: "???踵祥憭批飛嚗CCU嚗?",
          majorLabel: "銝颱耨",
          minorLabel: "頛頂",
          major1: "甇散隤?摮貊頂瘜?蝯?",
          major2: "憭漱摮?",
          minor1: "蝬?",
          point1: "璁桃??????5% GPA嚗?2021??023 撟氬?",
          point2: "?遙 AIESEC NCCU ?唳憪?銝餃葉??",
          gpa: "4.22 / 4.3",
          statRanking: "??",
          courseManagement: "蝞∠?摮?",
          courseDataAnalysis: "鞈?????撘身閮?VBA & Access嚗?",
          coursePython: "蝔?閮剛?璁?嚗ython嚗?",
          courseResearch: "?弦?寞?嚗 ?絞閮?",
          courseMarketing: "銵?弦嚗, Decanter AI嚗?",
          courseFinance: "????",
        },
        paris1: {
          period: "2024/01 ??2024/06",
          title: "?踵祥摮訾漱?飛??",
          school: "撌湧?蝚砌?憭批飛嚗aris 1 Panthéon?orbonne嚗?",
          point1: "瘛勗?撠?瘣脣????踵祥??閫??",
          point2: "?冽??脰?摮貉?????瘚詻?",
          course1: "?踵祥摮?",
          course2: "????",
          course3: "甇散?輻?",
          typeLabel: "鈭斗?",
          typeDomain: "?踵祥摮貉?????",
        },
        coursesLabel: "靽桃?隤脩?",
      },
      pageSwitcher: {
        business: "??",
        teaching: "?飛",
      },
      chapters: {
        aboutMe: "???",
        aboutMeDesc: "??隤?鞈風??摮貊?撽?摮豢風?嚗??拇閰摯???葦?臬?拙??具?",
        teachingService: "?飛??",
        teachingServiceDesc: "??靘?隤脩??批捆嚗誑??雿?蝝洵銝?玨??",
        learningResources: "摮貊?鞈?",
        learningResourcesDesc: "蝎暸撌亙?飛蝧?撌扯?蝝?嚗鼠?拇?刻玨??憭?蝥脫郊??",
      },
      booking: {
        title: "??隤脩?",
        subtitle: "憛怠神甇方”?株??蝜恬?????4撠??批?閬誑蝣箄??函?隤脩??挾??",
        navCta: "??隤脩?",
        durationLabel: "隤脩??",
        durationValue: "?臬恥鋆賢? ??30 / 45 / 60 / 90 ??嚗??券?瘙矽??",
        materialsLabel: "?飛??",
        materialsValue: "雿輻?芾ˊ?飛??嚗?靘飛??摰?摮貊???銝玨??冽捱摰?",
        formatLabel: "銝玨敶Ｗ?",
        formatValue: "蝺?嚗oom / Google Meet嚗?",
        langLabel: "?玨隤?",
        langValue: "?梯? · 瘜? · 銝剜?",
        responseLabel: "????",
        responseValue: "24撠??找誑Email?ine??",
        fieldName: "?函?憪?",
        fieldNamePh: "????",
        fieldContact: "?末?舐窗?孵?",
        contactHint: "隢?銝?mail?ine ID嚗?撠24撠??扯??刻蝜怒?",
        fieldEmail: "Email",
        fieldEmailPh: "example@mail.com",
        fieldLine: "Line ID",
        fieldLinePh: "?函?Line ID",
        fieldType: "隤脩?憿?",
        optionSelect: "-- 隢??--",
        optionIelts: "IELTS ??",
        optionCambridge: "Cambridge / ?冽??望炎",
        optionGrades: "摮豢?望?",
        optionSkill: "?孵???賢?撘?",
        optionOther: "?嗡?",
        fieldDuration: "?末隤脩??",
        dur30: "30 ??",
        dur45: "45 ??",
        dur60: "60 ??嚗?佗?",
        dur90: "90 ??",
        durCustom: "?嗡?? ?????銝剛牧??",
        fieldMaterials: "???末",
        matTeacher: "雿輻?葦?芾ˊ??",
        matStudent: "摮貊??芸?????",
        matBoth: "?抵???",
        fieldSlot: "?末?挾",
        fieldSlotPh: "靘??曹? 18:00??0:00?勗?拐?",
        fieldMsg: "??嚗憛恬?",
        fieldMsgPh: "?迄??桀???摨艾飛蝧璅?隞颱?????",
        submit: "????唾?",
        formNote: "甇方”?桃?垢蝷箇?嚗?亙 Formspree ??Netlify Forms 蝑???",
      },
      resources: {
        title: "摮貊?鞈?",
        subtitle: "?祥鞈?嚗鼠?拇?刻玨??憭毀蝧隤?隤?銝剜???",
        tabEn: "?? ?梯?",
        tabFr: "?? 瘜?",
        tabZh: "?? 銝剜?",
        websitesTitle: "蝬脩????函?撘?",
        tipsTitle: "摮貊??撌?",
        videosTitle: "敶梁?鞈?",
        bbc: "?祥隤脩??蔣??皜祇?嚗??蝔漲摮貊???",
        cambridge: "???梯??岫摰????",
        ieltsOfficial: "IELTS 摰?祥璅⊥閰血??????",
        quizlet: "?桀??∟?閰??嚗閮?桀?銵函?憟賢鼠??",
        tip1title: "瘥予??梯?",
        tip1: "瘥予?芷? 10 ???隤?Podcast ??YouTube嚗擗????漲???遙雿玨?研?",
        tip2title: "撖思?敺?銴?",
        tip2: "瘥予?刻?神銝撠挾閰梧?隞颱?銝駁???葆?啗玨??嚗???韏瑚耨?嫘?",
        tip3title: "????瘜?",
        tip3: "隞仿?憓???蝧?桀?嚗?憭抽?3憭抽?1?梧????Quizlet ??Anki ?芸???蝔?",
        tip4title: "憭扯隤芾隤?",
        tip4: "?????芋隞踵?隤牧閰梧???銝撌梁??脤?隤芣??Ｗ漲?芣????蝺渡????脫郊??",
        bbcYt: "?剔??飛嚗項??瘜?敶??潮??",
        duncan: "?瑟撘?剛玨蝔??拙??喟毀蝧?撖血?閰梁?銝剔?摮貊???",
        ted: "隞亦移敶拐蜓憿脰??脤??賢?蝺渡?嚗??券?蝔踹??賬?",
      },
      pageNav: {
        home: "擐?",
        overview: "蝮質汗",
        finance: "鞎∪??“??",
        marketing: "銵",
        teaching: "?飛",
        data: "?豢???蝛?",
      },
      financeHero: {
        kicker: "?豢??? · 蝑憿批? · 鞎∪?",
        title1: "敺?",
        title2: "蝑瘙箇?",
        summary: "撠梯? emlyon business school 蝣拙ㄚ?哨?鞎∪???閮???嚗??雓寧????賢???極?瑟??刻??平?摨佗??箄瓷??憿批????菟?潦?",
        ctaPrimary: "?舐鼠??",
        ctaSecondary: "?亦???蝬風",
        cardRole: "鞎∪? & 蝑憿批?",
        caseStudyLabel: "?詨?蝬風 · 鞎∪???摮?",
        caseStudyTitle: "?拇? ??鞎∪??◢?芰恣??",
        caseStudyDesc: "?遙?踹之????摮賊鞎∪??◢?芰恣?玨蝔????玨?飛??撠?隤脣??矽嚗風蝬?飛?遙??",
      },
      marketingHero: {
        kicker: "?訾?銵 · ?批捆?萎? · 蝮暹?銵",
        title1: "?菟?撖行??瑞?",
        title2: "?批捆蝑",
        summary: "撠梯? emlyon business school 蝣拙ㄚ?哨??曆蜓撠?Engoo 撠??詨董???批捆蝑嚗????抒汗??93%????+89%嚗????????嚗?冗蝢文??瑁?璆剔蜀????",
        ctaPrimary: "?亦?雿???",
        ctaSecondary: "?舐鼠??",
        cardRole: "?訾?銵 & ?批捆?萎?",
        caseStudyLabel: "獢??弦 · Engoo 撠???",
        caseStudyTitle: "撠??貊冗蝢斗?????銵冽 | Excel Analytics",
        caseStudyS: "? (Situation)嚗??撠??貊??豢??嚗隞仿???????蝞?撖衣?蝎結頧????批捆???梢??",
        caseStudyA: "銵? (Action)嚗?瘣?憪???拍璅????脤??砍?瑽遣???銵冽嚗祕?整??vs 銝????芸???璅?瘥?",
        caseStudyR: "?? (Result)嚗銵刻??蝭??瘥?5 撠??犖??銝阡??豢??曉鈭???擃?閬死憸冽嚗蝙鈭?????89%??",
        caseStudyInsight1: "????摮賊??蜓閬死???? (CTR) 瘥?瘣餅??◢?潮???25%??",
        caseStudyInsight2: "???格?摰Ｙ黎??????畾菟?銝剖?? 7 暺 9 暺?",
        caseStudyTemplate: "?亦?鈭?撘?Excel 蝭",
      },
      dataHero: {
        kicker: "?豢??? · 撣?弦 · ???寞?",
        title1: "敺?憪?",
        title2: "蝑瘣?",
        summary: "撠梯? emlyon business school 蝣拙ㄚ?哨??撠????頧??箏?瑁??捱蝑遣霅啜?蝺港蝙??R?ython?QL?xcel嚗OSA 950/1000嚗ower BI ??Tableau嚗??冽撣?弦?蜀????",
        ctaPrimary: "銝??銵冽嚗xcel嚗?",
        ctaSecondary: "?亦???蝬風",
        cardRole: "?豢??? & 撣?弦",
        caseStudyLabel: "獢??弦 · 撠??詨?銵冽",
        caseStudyTitle: "Excel ?銵冽 ??撠??貊蜀?蕭頩?",
        caseStudyDesc: "??Engoo 撠??詨董?遣蝡??渡? Excel ?銵冽嚗蕭頩?12 ???交?璅?KPI 璁汗?????隅?Ｚ? A/B ?望?瘥???",
      },
      portfolioTeaser: {
        label: "作品集",
        cta: "探索作品集 →",
      },
      marketingPortfolioTeaser: {
        title: "行銷活動、數據儀表板與品牌視覺",
        desc: "小紅書策略、績效分析與視覺創作。",
      },
      financePortfolioTeaser: {
        title: "分析、模型與案例研究",
        desc: "財務建模、數據分析與顧問交付成果。",
      },
      dataPortfolioTeaser: {
        title: "儀表板、視覺化與數據分析",
        desc: "Excel 儀表板、Power BI 報告與應用量化分析。",
      },
      indexPortfolioTeaser: {
        title: "具體成果與專案",
        desc: "行銷、數據、金融與教學 — 按領域探索專案。",
      },
      teachingHero: {
        kicker: "隤? · ?飛 · ??鈭斗?",
        title1: "頝刻?閮???嚗?",
        title2: "靽脫??漱瘚?",
        summary: "銝剜?瘥?雿輻???? DALF C1嚗?隤??ELTS 8.0嚗隤??LPT N1嚗隤?隤??楛摨血???閮憭乩撈閮?楊??鈭斗?瘣餃???",
        ctaSecondary: "?亦?????蝝??",
        availabilityLabel: "蝺??飛",
        availabilityValue: "蝺? · ?玨銝?",
      },
      teachingLanguages: {
        title: "隤??賢?",
        subtitle: "??隤??撣豢??具?",
      },
      teachingServices: {
        title: "?飛??",
        subtitle: "?澈??隤脩?嚗頛????憓葉嚗?瘥?摮貊?隞亥撌梁?甇亥矽蝛拙??脫郊??",
        philosophy: "瘥?隤脫??賣??寞?摮貊??瘙矽?湔撘?<strong>?</strong>??strong>???抒毀蝧?/strong>??strong>鈭?撠店</strong>嚗?摮貊??芰????",
        ielts: {
          title: "IELTS ??",
          desc: "?之??券閮毀嚗霈?神雿隤芥??岫蝑?芋?祆葫撽??犖?脣漲餈質馱??",
          tag1: "?梯??神雿?",
          tag2: "??牧???",
          tag3: "?岫蝑",
          tag4: "?格? Band 6.0 ??8.0+",
        },
        grades: {
          title: "?僑畾菔隤玨蝔?",
          desc: "靘?啁摮豢隤脩雇嚗?靘?撠擃葉?僑畾菔隤玨蝔項??瘜?敶霈?圾?隤”??",
          tag1: "??",
          tag2: "?葉",
          tag3: "擃葉",
          tag4: "隤脫平頛?",
        },
        exams: {
          title: "?冽??望炎 & ???梯?隤?",
          desc: "???冽??望炎嚗EPT嚗????梯?蝟餃??岫?頂蝯勗????剝?甇瑕?閰阡?瞍毀???閫???撌扼?",
          tag1: "YLE嚗?蝡亥瑼ｇ?",
          tag2: "A2 Key / B1 Preliminary",
          tag3: "B2 First",
          tag4: "?冽??望炎 GEPT",
        },
        skills: {
          title: "?桅??賢??撥",
          desc: "???桐???賣楛摨西?蝺湛?撖思??霈?隤芥?瘜??飛?∩????梯?撠?銵皞???",
          tag1: "撖思?",
          tag2: "?梯?",
          tag3: "??牧",
          tag4: "????敶?",
        },
      },
      teachingExp: {
        title: "?飛蝬風",
        subtitle: "蝺??梯?摰嗆??岫??撠?隞亙?蝧餉陌?撠???",
        translation: {
          period: "2022 ??2024",
          title: "蝧餉陌?撠??芰?交?嚗?",
          company: "?芰?交? · 摮貉??楊頛臬?獢?",
          point1: "銝剛瘜?隤飛銵?隞嗉?撠平?批捆蝧餉陌??",
          point2: "摮貉?隢???蝡?摰?鞈??撠?瞏斤阮????",
        },
      },
      teachingEngagement: {
        title: "隤??飛??????",
        subtitle: "隤?頛?????瘚貉???鈭斗?閮??",
      },
            experience: {
        title: "撖衣??極雿?撽?",
        subtitle: "瘨菔??訾?銵??????弦?拍?蝑????脯?",
        kpn: {
          period: "2025/01 ??2025/06",
          title: "?訾?銵撖衣???",
          point1: "蝬脩? SEO ?芸?嚗??Ｚ??銵嚗??批捆撱箄降??",
          point2: "餈質馱 KPI 銝血?????瘚??TR????嚗?",
          point3: "?瑁? SEA 撱????????",
          dataPoint1: "銝餃????弦撠?嚗??交雿蜀???菟???蝝?銝血??豢?頧??箇??亙遣霅唳?靘策????",
          dataPoint2: "閮剛?銝衣恣???瑟??賢?銵冽嚗B & Google嚗TR ?? +9.5%?VR ?? +5.1%??",
          dataPoint3: "?瑁?瘛勗蝡嗅??箸???嚗蒂?? Google Analytics & Search Console 餈質馱 KPI嚗??TR????嚗?",
          finTitle: "?訾?銵撖衣???撖衣?嚗?",
          finCompany: "KPN嚗?靘?SEO?EM?B 撱??蝑雿??瑟????砍嚗?",
          finPoint1: "蝞∠? Facebook ??Google Ads 瘥?撱????嚗蕭頩?ROI ??銝行??????砌誑?芸?瘥活?脣恥?嚗??? +5.1%嚗?",
          finPoint2: "?瑁?瘥?蝬脩???蝔賣嚗????萄榆?唳??銝西?頝典??賢???雿??文?憿?",
        },
        engoo: {
          period: "2024/10 ??2025/02",
          title: "銵撖衣???",
          point1: "隞?STP 璅∪?閬?撠??詨摰寧??伐??剝? A/B 皜祈岫?芸????身閮?3 ???找????? 89.1%??蝯脫憓? 69.7%??",
          point2: "蝡嗅???葫???曉?????銝?摮恥蝢方矽?渲?閬箇???",
          point3: "鋆賭? Meta 撟喳嚗acebook & Instagram嚗摰對?????隤踵扯?頞典?梢???",
          dataPoint1: "撱箇??? Excel ?銵冽??2 ???交?璅?? A/B 瘥???KPI 閬死???梁???5 撠??梯”????",
          dataPoint2: "?瑁?瘛勗撣???奎?皜穿??芸???蝪⊿?銝剜?撣嚗EDnote / 撠??賂??摰寧??乓?",
          dataPoint3: "?函蔡隞?STP 璅∪??箏蝷??豢?撽??批捆蝑?? ???抒汗??+93.3%???? +89.1%??蝯脫 +69.7%??",
          pythonPoint: "? Python ?芸???穿??游?瘥?豢?嚗????亙銵冽???",
          finTitle: "銵撖衣???撖衣?嚗?",
          finCompany: "Engoo, DMM.com嚗???銝?閮摮貊?撟喳嚗?",
          finPoint1: "?瑁?撣??嚗蝪⊿?銝剜?撣?嗅?銝衣移???瑞??乓?",
          finPoint2: "蝞∠?撠??賊?蜀???批捆???? ???抒汗??+93.3%???? +89.1%??蝯脫 +69.7%??",
          portfolioLink: "?亦?雿???(PDF)",
          excelLink: "銝?撠??豢??銵冽嚗xcel嚗?",
          excelHref: "assets/Engoo_XHS Dashboard_EN.xlsx",
          stat1: "?汗??",
          stat2: "蝎結??",
          stat3: "鈭???",
          screenshot1: "assets/Excel_Engoo/Engoo Dashboard_EN.png",
          screenshot2: "assets/Excel_Engoo/Engoo Data_EN.png",
          screenshotAlt1: "Performance Dashboard ??Engoo XHS",
          screenshotAlt2: "Raw Data ??Engoo XHS",
          showcaseLabel: "雿?撅內 · 撠??豢??銵冽",
          showcaseBadge1: "?? ?湧?蝮暹?",
          showcaseTitle1: "璁汗 · ?餈?30 憭?",
          showcaseDesc1: "撌血?憛??詨? KPI嚗汗??蝯脯???????漲嚗???豢???頞典?”??",
          showcaseBadge2: "?? A/B 瘥?",
          showcaseTitle2: "?餈?30 憭?vs ??30 憭?",
          showcaseDesc2: "?喳?憛?A/B ??頞典?脩?嚗?潸??亙??瑁?敺??批捆蝑?祕?蔣?踴?",
          showcaseBadge3: "?? ???豢?",
          showcaseTitle3: "瘥?豢???",
          showcaseDesc3: "瘥予 12 ??璅??汗?????瑯???????漲?佗?????閬箏???瑽??豢??箇???",
        },
        teaching: {
          period: "2023/07 ??2023/12嚗?024/07 ??2025/04",
          title: "隤脩??拇?",
          point1: "????◢?芰恣?玨蝔?摮詨?摮貊?頛???",
          point2: "鋆賭???銝西?鞎祈??踹?隤踴?",
          dataSupport: "?蝔?閮剛??????玨蝔?VBA?ccess嚗??飛?舀??",
          dataCoord: "?矽 9 ?隤脩????踹??歹?銝行?隞餃??孵摰喲?靽犖銋?????璅?",
          finTitle: "隤脩??拇?",
          finCompany: "???踵祥憭批飛????摮賊",
          finPoint1: "?矽 9 ?鞎⊿?隤脩????方??選??遙摮貊??葦?瑁?隡平??憭乩撈銋???璅?",
          finPoint2: "銝餅?鈭斗?瘣餃???獢陛?梧?蝣箔?蝚血??∟?嚗蒂?冽??????矽憭?拙拿??鈭箇?銵???",
        },
        tutorABC: {
          period: "2024/08 ???喃?",
          title: "蝺??梯?摰嗆??葦",
          point1: "銝撠?蝺??梯?隤脩?嚗???撠擃葉?僑畾萄飛??",
          point2: "??IELTS ??璈隤?霅?YLE?2 Key?1 Preliminary?2 First嚗?",
          coursesLabel: "?玨蝘",
          courseGradeSchool: "?望?嚗?撠?",
          courseMiddle: "?望?嚗?銝哨?",
          courseHigh: "?望?嚗?銝哨?",
          stat1: "?玨憭拇",
          stat2: "摮貊?鈭箸",
          stat3: "隤脣???",
          stat4: "餈質馱鈭箸",
          stat5: "?葦?潸?瘥?TTT嚗?",
        },
        research: {
          period: "2023/06 ??2023/12",
          title: "?弦?拍?",
          point1: "????蒂???弦???豢???",
          point2: "?啣神??銝西ˊ雿?閮??賊?鞈???",
          dataPoint1: "?? R ??Excel 隞仿???鞈芸????弦?寞???摰?蝬?霅圈?嚗Ⅱ靽漱隞????渲牲?扼?",
          dataPoint2: "鞈?????瘣???嚗撖恍???閬蒂鋆賭?????摮貉??降??渲???",
          finCompany: "???踵祥憭批飛?????弦銝剖?",
          finPoint1: "?鞈芸?隤踵???艘甇豢瘜???蝬?頞典?????",
        },
        filterAll: "?券",
        filterTeaching: "?飛",
        filterFinance: "??",
        filterMarketing: "銵",
        viewAll: "憿舐內?券",
        subtitleMarketing: "蝷曄黎慦??蜀???瑯摰孵雿?蝷曄黎蝬???",
        subtitleData: "?豢?????銵冽???渡?蝛嗚?",
        subtitleFinance: "鞎∪??????蝑憿批???",
      },
      portfolio: {
        title: "雿?????蝷曄黎蝬??身閮?",
        subtitle: "?琿???ˊ雿??批捆?恣??撣唾???閬箄身閮???",
        viewPdf: "?亦?摰雿???PDF嚗?",
        engoo: {
          tag: "蝷曄黎慦?",
          title: "Engoo ??撠??詨董????",
          desc: "?交?銝衣???Engoo 蝪∩葉撣撠??詨?璆剛?嚗???STP 璅∪??閬??批捆蝑嚗誑 A/B 皜祈岫餈凋誨?芸?????閬箇????寞?銝?摮恥蝢方身閮憿?",
          stat1: "?汗??",
          stat2: "蝎結??",
          stat3: "鈭???",
        },
        guzheng: {
          tag: "蝷曄黎蝞∠?",
          title: "?踹之?斤?蝷????蝎結撠?",
          desc: "鞎痊?踹之?斤?蝷曇??貊?蝯脣????亙虜蝬?嚗身閮暑?恐?喋???????蝑暑??閬死蝝???",
        },
        instagram: {
          tag: "?批捆?萎?",
          title: "?犖?梯?敹? Instagram 撣單",
          desc: "蝬? Instagram ?犖?梯?敹?撣單嚗??移敹身閮???楛摨行?摮??????貉??批捆?誨銵其????蝯阡?曉????望??頂??",
        },
        design: {
          tag: "?蔣?身閮?",
          title: "?蔣?暑?恐?唾身閮?",
          desc: "????芰憸冽?犖?抵?撱箇?嚗??潭??蝛?摨艾??ˊ雿暑?恐?喟????撘?蝷曉??絲?梯???蝷曄黎鞎潭?閮剛???",
        },
        packaging: {
          title: "?包裝設計競賽 ??蝚砍??怠?曀祈??",
          desc: "?? 2024 撟渡洵?撅筋?舐??包裝設計競賽嚗ˊ雿噩隞嗆暑?恐?唾?閬箇???",
        },
        insightLbl: "?瘣?",
        mkt: {
          heroTitle2: "& 創意設計",
          heroEyebrow: "?曄噬摨?· 蝎暸雿? · 2024??025",
          heroDesc: "?豢?撠????瑟暑??閬箄身閮?蝷曄黎蝞∠? ???典????銋??曉蝎暹??漱??",
          heroStatProjets: "雿?",
          heroStatGrowth: "撠??豢??瑞?",
          heroStatPart: "AIESEC ??鈭箸",
          filterAll: "?券",
          filterDashboard: "?豢??銵冽",
          filterCampagne: "銵瘣餃?",
          filterDesign: "閬死閮剛?",
          filterCommunity: "蝷曄黎蝞∠?",
          engoo: {
            num: "01 · 摰獢???",
            tag: "Excel ?銵冽 · 蝷曄黎?? · A/B 皜祈岫",
            sitLbl: "?? · ?????",
            actLbl: "銵? · ?銵冽?嗆?",
            resLbl: "?? · 銝???敶梢",
            statMet: "瘥餈質馱??",
            statVues: "?汗甈⊥ · 3 ??",
            statInter: "鈭???",
            statAb: "?? A/B 瘥?璅∠?",
          },
          aiesec: {
            num: "02 · 銵瘣餃?",
            tag: "銵瘣餃? · 閬死?孵?",
            body: "撣園? AIESEC NCCU ?犖銵??嚗?鞎?YOLO ??憭誘???湧?銵蝑?身閮蜓閬死?冗蝢方票??撽?敹極?飛?⊥???",
            statVol: "??敹極鈭箸",
            statPart: "??鈭箸",
            statBudget: "頞???格?",
          },
          guzhengNum: "03 · 蝷曄黎蝞∠?",
          penwardsNum: "04 · 閬死閮剛?",
          penwardsTag: "閮剛? · 蝡嗉魚",
          footerBack: "??餈?銵?",
          footerNext: "?豢???蝛嗡??? →",
        },
        data: {
          heroTitle1: "數據 &",
          heroTitle2: "市場研究",
          heroEyebrow: "曾郁庭 · 數據 & 市場研究",
          heroDesc: "Excel ?銵冽??????撣?弦 ??撠雓寧??豢???頧??箏?瑁???璆剜捱蝑?",
          heroStatProjets: "雿?",
          heroStatGrowth: "撠??豢??瑞?",
          heroStatHypo: "M&A ?身??",
          filterAll: "?券",
          filterDashboard: "?銵冽",
          filterAnalyse: "??",
          filterRecherche: "?弦",
          filterReporting: "?勗?",
          dashboard: {
            num: "01 · ?銵冽 · 獢???",
            sitLbl: "?? · ???",
            actLbl: "銵? · ?銵冽?嗆?",
            resLbl: "?? · 銝?????",
            statMet: "瘥餈質馱??",
            statVues: "?汗甈⊥ · 3 ??",
            statAb: "?? A/B 瘥?",
          },
          ma: {
            num: "02 · 撖西??弦 · ????",
            subtitle: "撖西??弦嚗?000??024嚗?3 ??閮?· 鞈?靘?嚗SEG Workspace / Refinitiv?GI?OLCON III?SI",
            sitLbl: "??",
            actLbl: "?弦?寞?",
            resLbl: "?詨??潛",
            statHypo: "撽??身??",
            statPeriod: "????",
            statIndices: "?踵祥?",
            btn: "?梯?摰?勗?嚗DF嚗?",
          },
          footerBack: "??銵雿???",
          footerNext: "??雿?????",
        },
        fin: {
          heroTitle1: "財務 &",
          heroTitle2: "量化分析",
          heroEyebrow: "曾郁庭 · 財務 & 量化分析",
          heroDesc: "?????祕霅遣璅∠?摮貉??弦 ???渲牲???瘜??Ｗ?舀??冽??瘙箇??祕鞈芣?撖?",
          heroStatProj: "雿?",
          heroStatData: "M&A 鞈?",
          heroStatHypo: "撽??身??",
          filterAll: "?券",
          filterAnalyse: "??",
          filterRecherche: "?弦",
          filterDistinction: "璁株亳",
          ma: {
            num: "01 · 撖西??弦 · ????",
            subtitle: "撖西??弦嚗?000??024嚗?3 ??閮?· 鞈?靘?嚗SEG Workspace / Refinitiv?GI?OLCON III?SI",
            sitLbl: "??",
            actLbl: "?弦?寞?",
            resLbl: "?詨??潛",
            statHypo: "撽??身??",
            statPeriod: "????",
            statIndices: "?踵祥?",
            btn: "?梯?摰?勗?嚗DF嚗?",
          },
          footerBack: "???豢???蝛嗡???",
          footerNext: "擐? →",
        },
      },
      projects: {
        title: "蝎暸撠?",
        subtitle: "撟曉隞?”?極雿撘??閎?飛銵?撖血?撠???",
      },
      extracurricular: {
        title: "隤脣?瘣餃?",
        subtitle: "?函冗???犖?菜平銝剖擗?撖虫???撠??",
        guzheng: {
          title: "???斤?蝷?銵???⊿",
          text:
            "鞎痊?????唳暑???冗蝢文像?堆?靘?擖矽?渲玨蝔???銝衣?颲行??箄?????潸”??",
          portfolioLink: "?亦?雿???(PDF)",
        },
        camps: {
          title: "Sora Education ??撟渡????勗??菔齒鈭?",
          text:
            "?雿丰隡游???蒂??鈭０甈∩??梁????啣神?平閮?恣?瓷??鞈嚗蒂?脰?撣隤踵?芸?隤脩????瑞??乓?",
          stat1: "???湔活",
        },
        clubs: {
          title: "?嗡??∪?蝷曉???",
          text:
            "?曉?????Ｖ漱瘚冗?隤?雓冗嚗oastmasters嚗??冗???冗??冗??",
        },
        filterAll: "?券",
        filterVolunteer: "敹極??",
        periodTBD: "??敺Ⅱ隤?",
        filterEntrepreneurship: "?菜平",
        filterClubs: "蝷曉?????",
        viewAll: "憿舐內?券",
        restoCoeur: {
          period: "2025/10 ???喃?",
          title: "蝢拙極 ??Restos du C?ur嚗?敹?撱喉?",
          org: "Les Restos du C?ur · 瘜?鈭粹????",
          point1: "??憌?潭嚗??拙摹?Ｘ?蝢斤敺撣賊ㄡ憌?氬?",
          point2: "憌????鋆?璆准?",
        },
      },
      volunteer: {
        title: "敹極??撠?撽?",
        subtitle: "撠釣?潭??脯?????蝷暹?敶梢??撖西???",
        aiesec: {
          period: "2024/09 ???喃?",
          title: "AIESEC in NCCU ?",
          org: "AIESEC ?僑????蝯?",
          point1:
            "撣園??犖銵??嚗?梯?憭誘????15 雿?撌亥? 60 憭?摮詨嚗?亥??嗆撟唾﹛?格?擃 53.7%??",
          point2:
            "???批???憭乩撈??嚗?絲憭?撌亥?鈭斗?撠???",
          stat1: "敹極??鈭箸",
          stat2: "摮詨鈭箸",
          stat3: "頞?格?",
          finTitle: "?",
          finOrg: "AIESEC NCCU嚗???蝯?嚗絞蝐???撌亥??恬?",
          finPoint1: "蝞∠?憭誘??撠????瓷??皜穿??芸??蝯?嚗蝙?嗆頞?格? 53.7%??",
        },
        usr: {
          period: "2024/09 ???喃?",
          title: "USR 憭批飛蝷暹?鞎砌遙閮敹極",
          org: "?踵祥憭批飛 憭批飛蝷暹?鞎砌遙颲血摰?",
          point1:
            "?憭???摰嗅滬摮戊??閮摮貊??????",
        },
        flagship: {
          period: "2023/09 ???喃?",
          title: "?航??閮 隤撈敹極",
          org: "?啁?航?瘚瑕??銝剖?",
          point1:
            "??瘣餃???閬踝??蝢?摮貊??楛撠??冗??????閫??",
        },
        buddy: {
          period: "2023/09 ??2025/01",
          title: "??摮貊? Buddy 隡撈",
          org: "?踵祥憭批飛 ????鈭???",
          point1:
            "?靘瘜?????????雿漱???拇??典?暑??憓?",
        },
        nuit: {
          period: "2023/12",
          title: "?銋??葉瘜?隤暑?誨銵?",
          org: "瘜??典???????????啣?撣???",
          point1:
            "隞?”隤脩?????靽?瘜?蝷暹????堆?隞乩葉瘜?隤?鈭急偶蝥撅?降憿???350 憭????漱瘚?",
          stat1: "??鈭箸",
          stat2: "隤?",
        },
      },
      honors: {
        title: "?飛??璁株亳",
        subtitle: "隞交?蝮曇?銵函?脣????抵??臬???",
        exchange: {
          title: "??典鞎颱漱??摮賊?",
          org: "銝剛瘞????",
          text: "隞亙?唳?蝮曄???舀?韏湔?鈭斗?摮貊???",
          year: "2024",
        },
        short: {
          title: "?踵祥憭批飛?剜??箏??脖耨?飛??",
          org: "???踵祥憭批飛",
          text: "?飛璆剛”?曉?荔??脰??拍??脖耨蝬祥??",
          year: "2024",
        },
        excellence: {
          title: "?踵祥憭批飛?詨????5% GPA嚗?",
          org: "???踵祥憭批飛",
          text: "憭活隞亦蝟餃? 5% ??蝮曄??瑞???",
          year: "2021, 2023",
        },
      },
      contact: {
        heading: "?舐窗??",
        intro:
          "撠祕蝧?獢?????頞??甇∟??唾?蝯行?嚗??敹怠?閬?",
        labelEmail: "?餃??萎辣",
        labelPhone: "?餉店",
        labelLocation: "??典",
        formName: "憪?",
        formEmail: "?餃??萎辣",
        formMessage: "閮",
        namePlaceholder: "?函?憪?",
        emailPlaceholder: "?函?靽∠拳",
        messagePlaceholder: "隢陛?剛牧???瘙?撠???",
        submit: "?閮",
        formNote:
          "甇方”?桃?垢蝷箇?嚗?亙 Formspree ??Netlify Forms 蝑???",
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
    // Usage: data-lang-show="zh"  ??visible only when ZH is active
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
      text: "Utilisation de RStudio pour l'analyse statistique, la visualisation et les études académiques.",
      byPage: {
        finance:   { text: "Régressions OLS et Logit, analyse de panel et tests d'hypothèses appliqués à la recherche en finance quantitative (M&A, données LSEG)." },
        data:      { text: "Méthodes quantitatives : régressions, ANOVA, visualisations statistiques et études de marché pour des analyses actionnables." },
        marketing: { text: "Études de marché et segmentation : R utilisé pour analyser les données d'audience et valider les stratégies de contenu." },
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
          actions: [{ label: "Voir l'expérience", href: "#exp-research" }],
        },
      ],
    },
    "data-python": {
      title: "Python – Analyse & Automatisation",
      text: "Utilisation de Python pour l'analyse de données, le traitement de fichiers et la création d'utils d'automatisation pour faciliter le travail quotidien.",
      byPage: {
        finance:   { text: "Automatisation de la consolidation de données financières et génération de rapports de performance marketing (CTR, CVR, ROI)." },
        data:      { text: "Scripts de nettoyage de données, calcul d'indicateurs et automatisation de la consolidation de données quotidiennes." },
        marketing: { text: "Script Python d'automatisation de la consolidation des données Xiaohongshu, réduisant le temps de reporting quotidien." },
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
          points: ["Bases de la programmation et application à l'analyse de données."]
        },
        {
          type: "Expérience",
          title: "Assistante de recherche",
          org: "Institut des Relations Internationales (NCCU)",
          meta: ["Taipei · Taïwan", "06/2023 – 12/2023"],
          points: ["Collecte, nettoyage et traitement de données pour la recherche."],
          actions: [{ label: "Voir l'expérience", href: "#exp-research" }],
        },
        {
          type: "Outil Personnel",
          title: "PDF Converter & Merger",
          org: "Python · win32com · pypdf",
          meta: ["Glisser-déposer · Word / PowerPoint / Excel / Images – PDF"],
          points: [
            "Conversion par glisser-déposer de fichiers Word (.docx), PowerPoint (.pptx), Excel (.xlsx) et images (JPG/PNG) en PDF via l'PI COM de Microsoft Office.",
            "Fusion automatique de plusieurs PDFs en un fichier unique si tous les fichiers déposés sont déj? des PDFs.",
          ],
        },
        {
          type: "Outil Personnel",
          title: "Auto-Push – Synchronisation automatique GitHub",
          org: "Git CLI · Batch Script",
          meta: ["Surveillance fichiers · git commit + push · toutes les 100s"],
          points: [
            "Script de surveillance qui détecte les modifications locales toutes les 100 secondes et exécute automatiquement git add – commit – push vers la branche main.",
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
      text: "Ma簾trise des méthodes quantitatives – régression OLS et Logit, analyse de panel, tests d'hypothèses, statistiques descriptives et inférentielles – appliquées à la recherche académique et aux études de marché.",
      byPage: {
        finance:   { text: "Régressions OLS et Logit sur données LSEG/Refinitiv (2000 – 024) pour tester l'impact du risque politique sur les opérations M&A." },
        data:      { text: "Méthodes quantitatives appliquées : régressions multivariées, analyse de corrélation et tests d'hypothèses pour la recherche et l'analyse de marché." },
        marketing: { text: "A/B testing statistique et segmentation d'audience pour mesurer l'impact des créas et identifier les leviers de croissance sur Xiaohongshu." },
      },
      en: {
        title: "Statistics & Quantitative Methods",
        text: "Proficient in quantitative methods – OLS and logit regression, panel data analysis, hypothesis testing, descriptive and inferential statistics – applied to academic research and market studies.",
        byPage: {
          finance:   { text: "OLS and logit regressions on LSEG/Refinitiv data (2000 – 024) to test the impact of political risk on M&A transactions." },
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
            "3 hypothèses testées sur données empiriques 2000 – 024 (LSEG / Refinitiv, WGI, POLCON III).",
            "Régression OLS panel (H1 volume M&A), modèle Logit (H2 abandon), OLS sur prime d'acquisition (H3).",
          ],
          actions: [{ label: "Voir le rapport", href: "assets/R_M%26A%20Deal%20Analysis/RECAPSS_Group%202_Final%20Paper.pdf" }],
        },
        {
          type: "Certification",
          title: "Data Literacy",
          org: " – ",
          meta: ["05/2026"],
          points: ["Lecture critique des données, interprétation des biais et communication des résultats."],
          actions: [{ label: "Ouvrir le certificat", href: "certificates/Data%20Liyeracy_TSENG%20Yu-Ting%20-%202026-05-16.pdf" }],
        },
      ],
    },
    "data-excel": {
      title: "Excel - TOSA 950/1000",
      text:
        "Modèles Excel avancés, suivi de KPIs et automatisation de reportings.",
      proofs: [
        {
          type: "Expérience",
          title: "Assistante Marketing",
          org: "Engoo",
          meta: ["Taipei · Taïwan", "10/2024 – 02/2025"],
          points: ["Dashboard de suivi de performance marketing et automatisation de rapports."],
          actions: [{ label: "Voir l'expérience", href: "#exp-engoo" }],
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
      portfolioLink: {
        fr: { label: "Voir le portfolio – Dashboard Engoo XHS", href: "portfolio-data.html" },
        en: { label: "View portfolio – Engoo XHS Dashboard",    href: "portfolio-data.html" },
        zh: { label: "查看作品集 – Engoo XHS 儀表板",             href: "portfolio-data.html" },
      },
      byPage: {
        finance:   { text: "Modèles Excel avancés pour le reporting financier, le suivi de KPIs (CTR, CVR, ROI) et la gestion de budgets publicitaires mensuels." },
        data:      { text: "Dashboard Excel dynamique (Tableaux Croisés, Formules imbriquées) pour suivre 12 métriques quotidiennes et comparer des périodes A/B." },
        marketing: { text: "Suivi de la performance des campagnes : automatisation du tableau de bord XHS (12 KPIs/jour, comparaison A/B de périodes)." },
      },
      en: {
        title: "Excel - TOSA 950/1000",
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
    "mkt-seo-technical": {
      title: "SEO Technique",
      text: "Garantir que les moteurs de recherche peuvent explorer et indexer le site sans obstacle : vitesse, mobile-first, Sitemap XML, Robots.txt, données structurées (Schema Markup), HTTPS, gestion des erreurs 404 / redirections 301 et structure d'URL.",
      proofs: [
        {
          type: "Expérience",
          title: "Assistante Marketing Digital",
          org: "KPN",
          meta: ["Taipei · Taïwan", "01/2025 – 06/2025"],
          points: [
            "Audit technique SEO (crawlabilité, vitesse, mobile-first) et recommandations d'optimisation.",
            "Suivi de KPIs via Google Search Console et Google Analytics 4.",
          ],
          actions: [{ label: "Voir l'expérience", href: "#exp-kpn" }],
        },
        {
          type: "Certification",
          title: "Google – Programme Marketing Digital",
          org: "Google",
          meta: ["Marketing digital"],
          points: ["Certification couvrant SEO technique, SEA, analytics et stratégie de contenu."],
          actions: [{ label: "Ouvrir le certificat", href: "certificates/Google?訾?鈭箸 – Ｙ揣閮''_霅''.pdf" }],
        },
      ],
      en: {
        title: "Technical SEO",
        text: "Ensuring search engine crawlers can crawl and index the site without barriers: site speed, mobile-first, XML Sitemap, Robots.txt, Schema Markup, HTTPS, 404 errors / 301 redirects management and URL structure optimisation.",
        proofs: [
          {
            type: "Experience",
            title: "Digital Marketing Assistant",
            org: "KPN",
            meta: ["Taipei · Taiwan", "01/2025 – 06/2025"],
            points: [
              "Technical SEO audit (crawlability, speed, mobile-first) and optimisation recommendations.",
              "KPI tracking via Google Search Console and Google Analytics 4.",
            ],
            actions: [{ label: "View experience", href: "#exp-kpn" }],
          },
        ],
      },
    },
    "mkt-seo-keyword": {
      title: "Recherche De Mots-Clés & Stratégie De Contenu",
      text: "Identifier ce que les prospects recherchent et créer du contenu qui répond à leurs besoins : analyse de l'intention de recherche (informationnelle, transactionnelle, navigationnelle), évaluation de la difficulté et du volume des mots-clés, architecture Topic Clusters et planification Pillar-Cluster.",
      proofs: [
        {
          type: "Expérience",
          title: "Assistante Marketing Digital",
          org: "KPN",
          meta: ["Taipei · Taïwan", "01/2025 – 06/2025"],
          points: [
            "Recherche de mots-clés et recommandations de contenus alignés avec l'intention de recherche.",
          ],
          actions: [{ label: "Voir l'expérience", href: "#exp-kpn" }],
        },
      ],
      en: {
        title: "Keyword Research & Content Strategy",
        text: "Identifying what prospects search for and creating content that answers their needs: search intent analysis (informational, transactional, navigational), keyword difficulty & volume assessment, Topic Clusters architecture and Pillar-Cluster planning.",
        proofs: [
          {
            type: "Experience",
            title: "Digital Marketing Assistant",
            org: "KPN",
            meta: ["Taipei · Taiwan", "01/2025 – 06/2025"],
            points: [
              "Keyword research and content recommendations aligned with search intent.",
            ],
            actions: [{ label: "View experience", href: "#exp-kpn" }],
          },
        ],
      },
    },
    "mkt-seo-onpage": {
      title: "SEO On-Page",
      text: "Optimiser les éléments visibles et internes de chaque page pour les moteurs de recherche et les utilisateurs : balises Title, Meta Description, hiérarchie Heading (H1–H3), attributs Alt des images, maillage interne et placement naturel des mots-clés.",
      proofs: [
        {
          type: "Expérience",
          title: "Assistante Marketing Digital",
          org: "KPN",
          meta: ["Taipei · Taïwan", "01/2025 – 06/2025"],
          points: [
            "Optimisation On-Page (balises, structure de contenu, maillage interne) et recommandations éditoriales.",
          ],
          actions: [{ label: "Voir l'expérience", href: "#exp-kpn" }],
        },
      ],
      en: {
        title: "On-Page SEO",
        text: "Optimising the visible and internal elements of each page for search engines and users: Title tags, Meta Descriptions, Heading hierarchy (H1–H3), image Alt attributes, internal linking and natural keyword placement.",
        proofs: [
          {
            type: "Experience",
            title: "Digital Marketing Assistant",
            org: "KPN",
            meta: ["Taipei · Taiwan", "01/2025 – 06/2025"],
            points: [
              "On-Page optimisation (tags, content structure, internal linking) and editorial recommendations.",
            ],
            actions: [{ label: "View experience", href: "#exp-kpn" }],
          },
        ],
      },
    },
    "mkt-seo-offpage": {
      title: "SEO Off-Page",
      text: "Renforcer l'autorité et la crédibilité du site aux yeux de Google : acquisition de backlinks, mentions de marque (Brand Mentions), signaux sociaux et relations presse digitale (Digital PR).",
      proofs: [],
      en: {
        title: "Off-Page SEO",
        text: "Building the site's authority and trustworthiness in Google's eyes: backlink acquisition, Brand Mentions, social signals and Digital PR.",
        proofs: [],
      },
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
          actions: [{ label: "Ouvrir le certificat", href: "certificates/Google%20Ads%20'?撱 – 隤'?.png" }],
        },
        {
          type: "Certification",
          title: "Google Ads – Annonces Vidéo",
          org: "Google",
          meta: ["Google Ads"],
          points: ["Certification officielle Google Ads Vidéo."],
          actions: [{ label: "Ouvrir le certificat", href: "certificates/Google%20Ads%20敶梁?撱 – 隤'?.png" }],
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
          actions: [{ label: "Voir l'expérience", href: "#exp-engoo" }],
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
          title: "Co-fondatrice – Sora Education",
          org: "Projet entrepreneurial",
          meta: ["Camps de jeunesse"],
          points: ["Études de marché et ajustement de l'offre et de la stratégie marketing."],
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
          actions: [{ label: "Ouvrir le certificat", href: "certificates/Google%20Ads%20撱 – 蝝'?隤'?.png" }],
        },
      ],
    },
    "prog-python": {
      title: "Python Pour L'nalyse De Données",
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
        "Utilisation de R pour l'analyse statistique, la visualisation et les études académiques.",
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
        "?criture de requêtes SQL de base pour interroger et agréger des données.",
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
    // ?? Finance – Analyse & Contrôle de Gestion ?????????????????????
    "fin-accounting": {
      title: "Financial Accounting",
      text: "Ma簾trise des états financiers (bilan, compte de résultat, flux de trésorerie), des normes comptables et de la comptabilité en partie double.",
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
          points: ["Suivi de la performance financière des campagnes : ROI, coûtt par acquisition, taux de conversion (+5,1% CVR)."],
          actions: [{ label: "Voir l'expérience", href: "#experience" }],
        },
        {
          type: "Activité",
          title: "Co-Fondatrice – Sora Education",
          org: "Projet entrepreneurial",
          meta: ["Camps de jeunesse"],
          points: ["Suivi du P&L de 5 camps d'été : pilotage des revenus, des coûtts variables et fixes, et atteinte de la rentabilité."],
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
      text: "Pilotage des coûtts par canal et optimisation des structures de coûtts pour maximiser la rentabilité.",
      proofs: [
        {
          type: "Expérience",
          title: "Assistante Marketing Digital",
          org: "KPN",
          meta: ["Taipei · Taïwan", "01/2025 – 06/2025"],
          points: ["Gestion des budgets publicitaires mensuels Facebook & Google Ads et optimisation du coûtt par acquisition (conversion rate +5.1%)."],
          actions: [{ label: "Voir l'expérience", href: "#experience" }],
        },
        {
          type: "Activité",
          title: "Membre – AIESEC in NCCU",
          org: "AIESEC",
          meta: ["Taipei · Taïwan", "09/2024 – 06/2025"],
          points: ["Gestion budgétaire d'un camp d'été : optimisation de la structure de coûtts, dépassement de l'objectif de rentabilité de 53,7%."],
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
          points: ["Reporting financier mensuel pour 5 camps d'été : suivi budgétaire, analyse des coûtts et pilotage de la rentabilité."],
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
      title: "Leadership & Gestion D'é'uipe",
      text:
        "Encadrement de petites équipes marketing et animation de groupes d'éétudiants.",
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
        "Planification, coordination et suivi de projets académiques, d'éénénements et de camps.",
      links: [
        {
          label: "Sora Education – organisation de 5 camps d'été",
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
        "Niveau C1 certifié en français, avec expérience d'éétudes et de présentations en France.",
      proofs: [
        {
          type: "Certificat",
          title: "DALF C1",
          org: "France ?ducation international",
          meta: ["Français"],
          points: ["Certification C1."],
          actions: [
            { label: "Ouvrir le certificat", href: "certificates/DALF%20C1_Certificate.pdf" },
          ],
        },
        {
          type: "Formation",
          title: "Programme d'ééchange",
          org: "Université Paris 1 Panthéon-Sorbonne",
          meta: ["Paris · France", "01/2024 – 06/2024"],
          points: ["Immersion académique et culturelle en France."],
          actions: [{ label: "Voir la formation", href: "#edu-paris1" }],
        },
      ],
    },
    "lang-japanese": {
      title: "Japonais – JLPT N1",
      text:
        "Niveau avancé de japonais (JLPT N1), utile pour comprendre la culture et les marchés d'sie de l'st.",
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
            "Soutien linguistique et culturel auprès d'élèves issus de familles transnationales (nouveaux immigrants / enfants de migrants).",
          ],
          actions: [{ label: "Voir l'engagement", href: "#engagement" }],
        },
      ],
    },

    // ?? Data & Analytics (nouvelles entrées) ?????????????????????????
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

    // ?? Marketing Digital (nouvelles entrées) ????????????????????????
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
          title: "Co-fondatrice – Sora Education",
          org: "Projet entrepreneurial",
          meta: ["Camps de jeunesse"],
          points: ["Planification et exécution de campagnes de recrutement pour 5 camps d'été."],
          actions: [{ label: "Voir activités", href: "#extracurricular" }],
        },
      ],
    },
    // ?? Consulting & Strategy ????????????????????
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
          title: "Co-fondatrice – Sora Education",
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
          title: "Co-fondatrice – Sora Education",
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

    // ?? Individual AI Tools ??????????????????????????????????????????
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
      text: "Développement assisté par l'IA – utilisation de modèles génératifs pour prototyper, déboguer et produire du code de manière interactive.",
      proofs: [{ type: "Projet Personnel", title: "Portfolio & outils d'automatisation", org: "Claude Code · Cursor", meta: ["Python · HTML/CSS · JS"], points: ["Construction de ce portfolio et de scripts d'automatisation via des workflows de vibe coding."] }],
      en: { title: "Vibe Coding", text: "AI-assisted development – using generative models to prototype, debug and produce code interactively.", proofs: [{ type: "Personal Project", title: "Portfolio & Automation Tools", org: "Claude Code · Cursor", meta: ["Python · HTML/CSS · JS"], points: ["Built this portfolio and automation scripts via vibe coding workflows."] }] },
    },

    // ?? Microsoft Office Suite ????????????????????????????????????????
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

    // ?? Creative Tools ???????????????????????????????????????????????
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
      text: "Création de visuels vectoriels : logos, icônes et illustrations pour supports imprimés et digitaux. Niveau débutant.",
      proofs: [],
      en: {
        title: "Adobe Illustrator",
        text: "Creating vector graphics: logos, icons and illustrations for print and digital media. Basic level.",
        proofs: [],
      },
    },
    "creative-acrobat": {
      title: "Adobe Photoshop",
      text: "Retouche photo, création de visuels et mise en page pour supports digitaux et imprimés. Niveau débutant.",
      proofs: [],
      en: {
        title: "Adobe Photoshop",
        text: "Photo editing, visual creation and layout for digital and print media. Basic level.",
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
      text: "Modélisation 3D et rendu pour visuels créatifs et animations. Niveau débutant.",
      proofs: [],
      en: {
        title: "Blender",
        text: "3D modelling and rendering for creative visuals and animations. Basic level.",
        proofs: [],
      },
    },

    // ?? Office Suite ?????????????????????????????????????????????????
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

    // Render portfolio link chip if defined for this skill
    const portfolioLink = data.portfolioLink?.[activeLang] ?? data.portfolioLink?.fr ?? null;
    if (portfolioLink) {
      const linkWrap = document.createElement("div");
      linkWrap.className = "proof-portfolio-link";
      const a = document.createElement("a");
      a.href = portfolioLink.href;
      a.className = "skill-card";
      a.textContent = portfolioLink.label;
      linkWrap.appendChild(a);
      previewProofs.appendChild(linkWrap);
    }
  }

  const skillChips = document.querySelectorAll(".skill-card[data-skill]");

  // Element-based selection: only the exact hovered/clicked chip is highlighted,
  // preventing duplicates when the same data-skill key appears in multiple blocks.
  function setActiveSkill(activeChipEl) {
    skillChips.forEach((c) => c.classList.toggle("is-skill-active", c === activeChipEl));
  }

  const skillsLayout = document.querySelector(".skills-layout");

  skillChips.forEach((chip) => {
    function triggerPreview() {
      const key = chip.getAttribute("data-skill");
      if (key) {
        setActiveSkill(chip);
        updateSkillPreview(key);
        skillsLayout?.classList.add("info-active");
      }
    }
    chip.addEventListener("mouseenter", triggerPreview);
    chip.addEventListener("click", (e) => {
      e.stopPropagation();
      triggerPreview();
    });
  });

  // ?? Shared filter animation helper ????????????????
  const FADE_DURATION = 190; // ms ??must match CSS .filter-fade-out transition

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

  // ?? Reset preview to default placeholder ??????????
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
  const skillAreaFilters = skillsSection?.querySelectorAll("button[data-skill-area], [data-skill-area='all']") || [];
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
        resetSkillPreview(); // ??clear preview when switching category
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

  // ?? Scroll progress bar ???????????????????????????????
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

  // ?? Scroll reveal ?????????????????????????????????????
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

  // ?? Active nav on scroll ??????????????????????????????
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

  // ?? Hero card mouse tilt ??????????????????????????????
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

