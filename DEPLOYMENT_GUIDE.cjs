// This file is just used to generate the docx guide. You can delete it.
const fs = require("fs");
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
        ShadingType, PageNumber, PageBreak, LevelFormat, ExternalHyperlink } = require("docx");

const orange = "FF6B00";
const darkText = "1A1A2E";
const gray = "6B7280";
const lightBg = "FFF7ED";
const borderColor = "E5E7EB";

const border = { style: BorderStyle.SINGLE, size: 1, color: borderColor };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22, color: darkText } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: orange },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: darkText },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: "444444" },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: "steps",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "Step %1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } }, run: { bold: true, color: orange } } }] },
      { reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "steps2",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "Step %1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } }, run: { bold: true, color: orange } } }] },
      { reference: "steps3",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "Step %1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } }, run: { bold: true, color: orange } } }] },
      { reference: "steps4",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "Step %1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } }, run: { bold: true, color: orange } } }] },
      { reference: "bullets2",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [
    // ===== COVER PAGE =====
    {
      properties: {
        page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
      },
      children: [
        new Paragraph({ spacing: { before: 3000 }, alignment: AlignmentType.CENTER, children: [] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 },
          children: [new TextRun({ text: "LocalEats", size: 72, bold: true, color: orange, font: "Arial" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 },
          children: [new TextRun({ text: "Food Delivery Application", size: 36, color: darkText })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 },
          children: [new TextRun({ text: "Production Deployment Guide", size: 28, color: gray })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 },
          border: { top: { style: BorderStyle.SINGLE, size: 2, color: orange, space: 10 } },
          children: [] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 },
          children: [new TextRun({ text: "3 things you need to set up:", size: 24, color: gray })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 },
          children: [new TextRun({ text: "1. GitHub Account  →  2. Firebase Project  →  3. Vercel Deployment", size: 24, bold: true, color: darkText })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 600 },
          children: [new TextRun({ text: "Total time: ~30 minutes", size: 22, color: gray, italics: true })] }),
        new Paragraph({ children: [new PageBreak()] }),
      ]
    },

    // ===== PART 1: GITHUB =====
    {
      properties: {
        page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } },
      },
      headers: {
        default: new Header({ children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "LocalEats Deployment Guide", size: 18, color: gray, italics: true })]
        })] })
      },
      footers: {
        default: new Footer({ children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Page ", size: 18, color: gray }), new TextRun({ children: [PageNumber.CURRENT], size: 18, color: gray })]
        })] })
      },
      children: [
        // PART 1 HEADER
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Part 1: Create a GitHub Account")] }),
        new Paragraph({ spacing: { after: 200 },
          children: [new TextRun({ text: "GitHub stores your code online so Vercel can deploy it. Think of it like Google Drive for code.", color: gray })] }),

        new Paragraph({ numbering: { reference: "steps", level: 0 }, spacing: { after: 120 },
          children: [new TextRun({ text: " Go to " }), new TextRun({ text: "github.com", bold: true, color: orange }),
            new TextRun({ text: " and click " }), new TextRun({ text: "\"Sign Up\"", bold: true })] }),

        new Paragraph({ numbering: { reference: "steps", level: 0 }, spacing: { after: 120 },
          children: [new TextRun(" Enter your email, create a password, and choose a username")] }),

        new Paragraph({ numbering: { reference: "steps", level: 0 }, spacing: { after: 120 },
          children: [new TextRun(" Verify your email (check inbox for a code)")] }),

        new Paragraph({ numbering: { reference: "steps", level: 0 }, spacing: { after: 120 },
          children: [new TextRun(" Once logged in, click the "), new TextRun({ text: "\"+\"", bold: true }),
            new TextRun(" button (top-right) and select "), new TextRun({ text: "\"New repository\"", bold: true })] }),

        new Paragraph({ numbering: { reference: "steps", level: 0 }, spacing: { after: 120 },
          children: [new TextRun(" Fill in these details:")] }),

        new Table({
          width: { size: 8000, type: WidthType.DXA },
          columnWidths: [3000, 5000],
          rows: [
            new TableRow({ children: [
              new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: cellMargins,
                shading: { fill: lightBg, type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Field", bold: true })] })] }),
              new TableCell({ borders, width: { size: 5000, type: WidthType.DXA }, margins: cellMargins,
                shading: { fill: lightBg, type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "What to Enter", bold: true })] })] }),
            ]}),
            ...[ ["Repository name", "localeats"], ["Description", "Food delivery app for my local area"],
                 ["Visibility", "Public (select this)"], ["Initialize", "Do NOT check any boxes"] ]
              .map(([field, value]) => new TableRow({ children: [
                new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: cellMargins,
                  children: [new Paragraph({ children: [new TextRun(field)] })] }),
                new TableCell({ borders, width: { size: 5000, type: WidthType.DXA }, margins: cellMargins,
                  children: [new Paragraph({ children: [new TextRun({ text: value, bold: true })] })] }),
              ]}))
          ]
        }),

        new Paragraph({ spacing: { before: 200 } , children: [] }),
        new Paragraph({ numbering: { reference: "steps", level: 0 }, spacing: { after: 120 },
          children: [new TextRun(" Click "), new TextRun({ text: "\"Create Repository\"", bold: true, color: orange })] }),

        new Paragraph({ numbering: { reference: "steps", level: 0 }, spacing: { after: 120 },
          children: [new TextRun(" Now push your code. Open terminal in your "), new TextRun({ text: "localeats", bold: true }),
            new TextRun(" folder and run these commands one by one:")] }),

        // Code block
        new Paragraph({ spacing: { before: 100 }, shading: { fill: "F1F5F9", type: ShadingType.CLEAR },
          indent: { left: 720 },
          children: [new TextRun({ text: "git init", font: "Courier New", size: 20 })] }),
        new Paragraph({ shading: { fill: "F1F5F9", type: ShadingType.CLEAR }, indent: { left: 720 },
          children: [new TextRun({ text: "git add .", font: "Courier New", size: 20 })] }),
        new Paragraph({ shading: { fill: "F1F5F9", type: ShadingType.CLEAR }, indent: { left: 720 },
          children: [new TextRun({ text: 'git commit -m "first commit"', font: "Courier New", size: 20 })] }),
        new Paragraph({ shading: { fill: "F1F5F9", type: ShadingType.CLEAR }, indent: { left: 720 },
          children: [new TextRun({ text: "git branch -M main", font: "Courier New", size: 20 })] }),
        new Paragraph({ shading: { fill: "F1F5F9", type: ShadingType.CLEAR }, indent: { left: 720 },
          children: [new TextRun({ text: "git remote add origin https://github.com/YOUR_USERNAME/localeats.git", font: "Courier New", size: 20 })] }),
        new Paragraph({ shading: { fill: "F1F5F9", type: ShadingType.CLEAR }, indent: { left: 720 }, spacing: { after: 200 },
          children: [new TextRun({ text: "git push -u origin main", font: "Courier New", size: 20 })] }),

        new Paragraph({ spacing: { after: 100 },
          children: [new TextRun({ text: "⚠️ Replace ", color: gray }),
            new TextRun({ text: "YOUR_USERNAME", bold: true }),
            new TextRun({ text: " with the username you just created on GitHub.", color: gray })] }),

        new Paragraph({ spacing: { after: 200 },
          children: [new TextRun({ text: "It will ask for your GitHub username and password. For password, you need a Personal Access Token — go to GitHub → Settings → Developer Settings → Personal Access Tokens → Generate New Token. Check all boxes and copy the token. Use that as your password.", color: gray })] }),

        new Paragraph({ children: [new PageBreak()] }),

        // ===== PART 2: FIREBASE =====
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Part 2: Set Up Firebase (Your Database)")] }),
        new Paragraph({ spacing: { after: 200 },
          children: [new TextRun({ text: "Firebase stores your restaurants, menus, orders, and user data. It also sends real-time updates when orders come in!", color: gray })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("A. Create Firebase Project")] }),

        new Paragraph({ numbering: { reference: "steps2", level: 0 }, spacing: { after: 120 },
          children: [new TextRun(" Go to "), new TextRun({ text: "console.firebase.google.com", bold: true, color: orange }),
            new TextRun(" and sign in with your Google account")] }),

        new Paragraph({ numbering: { reference: "steps2", level: 0 }, spacing: { after: 120 },
          children: [new TextRun(" Click "), new TextRun({ text: "\"Create a project\"", bold: true })] }),

        new Paragraph({ numbering: { reference: "steps2", level: 0 }, spacing: { after: 120 },
          children: [new TextRun(" Name it "), new TextRun({ text: "LocalEats", bold: true }),
            new TextRun(" and click Continue")] }),

        new Paragraph({ numbering: { reference: "steps2", level: 0 }, spacing: { after: 120 },
          children: [new TextRun(" Enable Google Analytics (just click Continue and select Default Account)")] }),

        new Paragraph({ numbering: { reference: "steps2", level: 0 }, spacing: { after: 200 },
          children: [new TextRun(" Wait for the project to be created, then click "), new TextRun({ text: "\"Continue\"", bold: true })] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("B. Add a Web App")] }),

        new Paragraph({ numbering: { reference: "steps3", level: 0 }, spacing: { after: 120 },
          children: [new TextRun(" On the project homepage, click the "), new TextRun({ text: "web icon (</> symbol)", bold: true })] }),

        new Paragraph({ numbering: { reference: "steps3", level: 0 }, spacing: { after: 120 },
          children: [new TextRun(" Name it "), new TextRun({ text: "\"LocalEats Web\"", bold: true }),
            new TextRun(" and click "), new TextRun({ text: "\"Register App\"", bold: true })] }),

        new Paragraph({ numbering: { reference: "steps3", level: 0 }, spacing: { after: 120 },
          children: [new TextRun(" You will see a code block with your Firebase config. "),
            new TextRun({ text: "COPY THE ENTIRE firebaseConfig OBJECT.", bold: true, color: orange }),
            new TextRun(" It looks like this:")] }),

        // Config code block
        new Paragraph({ spacing: { before: 100 }, shading: { fill: "F1F5F9", type: ShadingType.CLEAR }, indent: { left: 720 },
          children: [new TextRun({ text: "const firebaseConfig = {", font: "Courier New", size: 20 })] }),
        new Paragraph({ shading: { fill: "F1F5F9", type: ShadingType.CLEAR }, indent: { left: 720 },
          children: [new TextRun({ text: '  apiKey: "AIzaSy...",', font: "Courier New", size: 20 })] }),
        new Paragraph({ shading: { fill: "F1F5F9", type: ShadingType.CLEAR }, indent: { left: 720 },
          children: [new TextRun({ text: '  authDomain: "localeats-xxxxx.firebaseapp.com",', font: "Courier New", size: 20 })] }),
        new Paragraph({ shading: { fill: "F1F5F9", type: ShadingType.CLEAR }, indent: { left: 720 },
          children: [new TextRun({ text: '  projectId: "localeats-xxxxx",', font: "Courier New", size: 20 })] }),
        new Paragraph({ shading: { fill: "F1F5F9", type: ShadingType.CLEAR }, indent: { left: 720 },
          children: [new TextRun({ text: "  ...", font: "Courier New", size: 20 })] }),
        new Paragraph({ shading: { fill: "F1F5F9", type: ShadingType.CLEAR }, indent: { left: 720 }, spacing: { after: 200 },
          children: [new TextRun({ text: "};", font: "Courier New", size: 20 })] }),

        new Paragraph({ numbering: { reference: "steps3", level: 0 }, spacing: { after: 120 },
          children: [new TextRun(" Open "), new TextRun({ text: "src/firebase.js", bold: true, font: "Courier New" }),
            new TextRun(" in your project and "), new TextRun({ text: "replace the placeholder config", bold: true }),
            new TextRun(" with your real config values")] }),

        new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("C. Enable Firestore Database")] }),

        new Paragraph({ numbering: { reference: "steps4", level: 0 }, spacing: { after: 120 },
          children: [new TextRun(" In Firebase console, click "), new TextRun({ text: "\"Build\"", bold: true }),
            new TextRun(" in the left sidebar, then "), new TextRun({ text: "\"Firestore Database\"", bold: true })] }),

        new Paragraph({ numbering: { reference: "steps4", level: 0 }, spacing: { after: 120 },
          children: [new TextRun(" Click "), new TextRun({ text: "\"Create database\"", bold: true })] }),

        new Paragraph({ numbering: { reference: "steps4", level: 0 }, spacing: { after: 120 },
          children: [new TextRun(" Select "), new TextRun({ text: "\"Start in test mode\"", bold: true }),
            new TextRun(" (this allows reading/writing for 30 days — we will add proper rules later)")] }),

        new Paragraph({ numbering: { reference: "steps4", level: 0 }, spacing: { after: 120 },
          children: [new TextRun(" Select your nearest location ("), new TextRun({ text: "asia-south1 (Mumbai)", bold: true }),
            new TextRun(" for India) and click "), new TextRun({ text: "\"Enable\"", bold: true })] }),

        new Paragraph({ spacing: { after: 200 },
          children: [new TextRun({ text: "D. Load Your Demo Data", bold: true, size: 28 })] }),
        new Paragraph({ spacing: { after: 120 },
          children: [new TextRun("After connecting Firebase, run your app locally (npm run dev), open the browser console (press F12), and type:")] }),
        new Paragraph({ spacing: { before: 100, after: 200 }, shading: { fill: "F1F5F9", type: ShadingType.CLEAR }, indent: { left: 720 },
          children: [new TextRun({ text: "import('/src/utils/seedFirebase.js').then(m => m.seedFirebase())", font: "Courier New", size: 20 })] }),
        new Paragraph({ spacing: { after: 200 },
          children: [new TextRun({ text: "This loads all 6 demo restaurants and their menus into your database. You only need to do this once!", color: gray })] }),

        new Paragraph({ children: [new PageBreak()] }),

        // ===== PART 3: VERCEL =====
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Part 3: Deploy on Vercel (Go Live!)")] }),
        new Paragraph({ spacing: { after: 200 },
          children: [new TextRun({ text: "Vercel will host your app for free and give you a URL like localeats.vercel.app that anyone can open on their phone!", color: gray })] }),

        new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 120 },
          children: [new TextRun(" Go to "), new TextRun({ text: "vercel.com", bold: true, color: orange }),
            new TextRun(" and click "), new TextRun({ text: "\"Sign Up\"", bold: true })] }),

        new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 120 },
          children: [new TextRun(" Choose "), new TextRun({ text: "\"Continue with GitHub\"", bold: true }),
            new TextRun(" and authorize Vercel")] }),

        new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 120 },
          children: [new TextRun(" Click "), new TextRun({ text: "\"Add New Project\"", bold: true })] }),

        new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 120 },
          children: [new TextRun(" Find your "), new TextRun({ text: "localeats", bold: true }),
            new TextRun(" repository and click "), new TextRun({ text: "\"Import\"", bold: true })] }),

        new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 120 },
          children: [new TextRun(" Framework Preset will auto-detect "), new TextRun({ text: "\"Vite\"", bold: true }),
            new TextRun(" — leave it as is")] }),

        new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 120 },
          children: [new TextRun(" Click "), new TextRun({ text: "\"Deploy\"", bold: true, color: orange }),
            new TextRun(" and wait 1-2 minutes")] }),

        new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 200 },
          children: [new TextRun(" Your app is now LIVE at "), new TextRun({ text: "https://localeats.vercel.app", bold: true, color: orange }),
            new TextRun(" (or similar URL)!")] }),

        new Paragraph({ spacing: { before: 200, after: 200 },
          shading: { fill: "F0FFF4", type: ShadingType.CLEAR },
          border: { left: { style: BorderStyle.SINGLE, size: 6, color: "22C55E", space: 10 } },
          indent: { left: 200 },
          children: [new TextRun({ text: "✅ That’s it! ", bold: true, color: "22C55E" }),
            new TextRun({ text: "Share the URL via WhatsApp with people in your area. They can open it on any phone browser — no app download needed!" })] }),

        new Paragraph({ children: [new PageBreak()] }),

        // ===== AUTO-DEPLOY =====
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Bonus: Auto-Deploy Updates")] }),
        new Paragraph({ spacing: { after: 200 },
          children: [new TextRun("Every time you make changes and push to GitHub, Vercel automatically updates your live app! Just run:")] }),

        new Paragraph({ shading: { fill: "F1F5F9", type: ShadingType.CLEAR }, indent: { left: 400 },
          children: [new TextRun({ text: "git add .", font: "Courier New", size: 20 })] }),
        new Paragraph({ shading: { fill: "F1F5F9", type: ShadingType.CLEAR }, indent: { left: 400 },
          children: [new TextRun({ text: 'git commit -m "updated something"', font: "Courier New", size: 20 })] }),
        new Paragraph({ shading: { fill: "F1F5F9", type: ShadingType.CLEAR }, indent: { left: 400 }, spacing: { after: 200 },
          children: [new TextRun({ text: "git push", font: "Courier New", size: 20 })] }),

        new Paragraph({ spacing: { after: 200 },
          children: [new TextRun("Vercel picks it up and deploys within 1 minute. No extra steps!")] }),

        // ===== CHECKLIST =====
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Production Checklist")] }),

        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [600, 5760, 3000],
          rows: [
            new TableRow({ children: [
              new TableCell({ borders, width: { size: 600, type: WidthType.DXA }, margins: cellMargins,
                shading: { fill: orange, type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "✔", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ borders, width: { size: 5760, type: WidthType.DXA }, margins: cellMargins,
                shading: { fill: orange, type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Task", bold: true, color: "FFFFFF" })] })] }),
              new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: cellMargins,
                shading: { fill: orange, type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Status", bold: true, color: "FFFFFF" })] })] }),
            ]}),
            ...[
              ["GitHub account created", ""],
              ["Code pushed to GitHub", ""],
              ["Firebase project created", ""],
              ["Firestore database enabled", ""],
              ["Firebase config added to src/firebase.js", ""],
              ["Demo data seeded to Firebase", ""],
              ["Vercel account created", ""],
              ["App deployed on Vercel", ""],
              ["Tested on phone browser", ""],
              ["Shared URL with friends to test", ""],
              ["Added real local restaurants via Admin Panel", ""],
            ].map(([task, status]) => new TableRow({ children: [
              new TableCell({ borders, width: { size: 600, type: WidthType.DXA }, margins: cellMargins,
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "□", size: 28 })] })] }),
              new TableCell({ borders, width: { size: 5760, type: WidthType.DXA }, margins: cellMargins,
                children: [new Paragraph({ children: [new TextRun(task)] })] }),
              new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: cellMargins,
                children: [new Paragraph({ children: [new TextRun({ text: status || "Pending", color: gray })] })] }),
            ]}))
          ]
        }),

        new Paragraph({ spacing: { before: 400, after: 200 },
          children: [new TextRun({ text: "Need help? Come back to Claude anytime — I can help fix errors, add features, or debug issues!", color: gray, italics: true })] }),
      ]
    }
  ]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/sessions/charming-wizardly-mccarthy/mnt/Food Delivery Application/LocalEats - Production Deployment Guide.docx", buffer);
  console.log("Guide created!");
});
