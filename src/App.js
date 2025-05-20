import { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

function App() {
  // Opções de idioma para a aplicação
  const idiomasApp = [
    { codigo: "pt", nome: "Português" },
    { codigo: "en", nome: "English" },
    { codigo: "es", nome: "Español" },
  ];

  // Textos traduzidos
  const textos = {
    pt: {
      tituloApp: "Gerador de Currículo",
      subtituloApp: "Crie um currículo minimalista e otimizado para ATS",
      dicasATS: "Dicas para um currículo ATS-friendly",
      dicasLista: [
        "Use palavras-chave relevantes para a vaga",
        "Mantenha o formato simples e legível",
        "Inclua métricas e resultados concretos",
        "Destaque suas principais habilidades técnicas"
      ],
      campos: {
        nome: "Nome Completo*",
        cargoDesejado: "Cargo Desejado",
        codigoPais: "Código do País",
        ddd: "DDD",
        telefone: "Telefone",
        cidade: "Cidade",
        linkedin: "LinkedIn",
        portfolio: "Portfolio/GitHub",
        email: "Email*",
        resumo: "Resumo Profissional*",
        experiencia: "Experiência Profissional",
        formacao: "Formação Acadêmica",
        habilidades: "Habilidades Técnicas",
        idiomas: "Idiomas",
        certificacoes: "Certificações",
        tipoFormacao: "Tipo de Formação",
        curso: "Curso*",
        instituicao: "Instituição*",
        periodo: "Período",
        cargo: "Cargo",
        empresa: "Empresa",
        tecnologias: "Tecnologias utilizadas",
        atividades: "Atividades realizadas",
        resultados: "Resultados alcançados (com métricas)",
        idioma: "Idioma",
        nivel: "Nível",
        certificacao: "Certificação"
      },
      placeholders: {
        nome: "Ex: João da Silva",
        cargoDesejado: "Ex: Desenvolvedor Front-end React",
        ddd: "Ex: 11",
        telefone: "Ex: 99999-9999",
        cidade: "Ex: São Paulo, SP",
        linkedin: "seuperfil",
        portfolio: "Ex: github.com/seuuser",
        email: "Ex: seuemail@exemplo.com",
        resumo: "Ex: Desenvolvedor Front-end com 5 anos de experiência...",
        curso: "Ex: Bacharelado em Ciência da Computação",
        instituicao: "Ex: Universidade de São Paulo",
        periodo: "Ex: 2015 - 2019",
        cargo: "Ex: Desenvolvedor Front-end React",
        empresa: "Ex: Google Inc.",
        tecnologias: "Ex: React, TypeScript, Redux, Node.js",
        atividades: "Descreva suas responsabilidades (1 item por linha)",
        resultados: "Ex: Reduzi o tempo de carregamento em 40% através de...",
        habilidades: "Ex: JavaScript, React, Node.js, HTML/CSS, Git, AWS, Docker",
        idioma: "Ex: Inglês",
        certificacao: "Ex: Certificação AWS Cloud Practitioner"
      },
      botoes: {
        adicionarExperiencia: "Adicionar Experiência",
        adicionarFormacao: "Adicionar Formação",
        adicionarIdioma: "Adicionar Idioma",
        adicionarCertificacao: "Adicionar Certificação",
        gerarCV: "Gerar Currículo em PDF"
      },
      mensagens: {
        nenhumaExperiencia: "Nenhuma experiência adicionada (opcional)",
        nenhumIdioma: "Nenhum idioma adicionado (opcional)",
        nenhumaCertificacao: "Nenhuma certificação adicionada (opcional)",
        sucesso: "Currículo gerado com sucesso!",
        gerando: "Gerando Currículo..."
      },
      secoesPDF: {
        resumo: "RESUMO",
        experiencia: "EXPERIÊNCIA",
        formacao: "FORMAÇÃO",
        habilidades: "HABILIDADES",
        idiomas: "IDIOMAS",
        certificacoes: "CERTIFICAÇÕES"
      },
      niveisIdioma: [
        "Básico", "Intermediário", "Avançado", "Fluente", "Nativo"
      ]
    },
    en: {
      tituloApp: "Resume Generator",
      subtituloApp: "Create a minimalist and ATS-optimized resume",
      dicasATS: "Tips for an ATS-friendly resume",
      dicasLista: [
        "Use relevant keywords for the position",
        "Keep the format simple and readable",
        "Include metrics and concrete results",
        "Highlight your main technical skills"
      ],
      campos: {
        nome: "Full Name*",
        cargoDesejado: "Desired Position",
        codigoPais: "Country Code",
        ddd: "Area Code",
        telefone: "Phone",
        cidade: "City",
        linkedin: "LinkedIn",
        portfolio: "Portfolio/GitHub",
        email: "Email*",
        resumo: "Professional Summary*",
        experiencia: "Professional Experience",
        formacao: "Education",
        habilidades: "Technical Skills",
        idiomas: "Languages",
        certificacoes: "Certifications",
        tipoFormacao: "Education Level",
        curso: "Course*",
        instituicao: "Institution*",
        periodo: "Period",
        cargo: "Position",
        empresa: "Company",
        tecnologias: "Technologies used",
        atividades: "Responsibilities",
        resultados: "Achievements (with metrics)",
        idioma: "Language",
        nivel: "Level",
        certificacao: "Certification"
      },
      placeholders: {
        nome: "Ex: John Smith",
        cargoDesejado: "Ex: React Front-end Developer",
        ddd: "Ex: 212",
        telefone: "Ex: 555-123-4567",
        cidade: "Ex: New York, NY",
        linkedin: "yourprofile",
        portfolio: "Ex: github.com/youruser",
        email: "Ex: your.email@example.com",
        resumo: "Ex: Front-end Developer with 5 years of experience...",
        curso: "Ex: Bachelor's in Computer Science",
        instituicao: "Ex: University of São Paulo",
        periodo: "Ex: 2015 - 2019",
        cargo: "Ex: React Front-end Developer",
        empresa: "Ex: Google Inc.",
        tecnologias: "Ex: React, TypeScript, Redux, Node.js",
        atividades: "Describe your responsibilities (1 item per line)",
        resultados: "Ex: Reduced loading time by 40% through...",
        habilidades: "Ex: JavaScript, React, Node.js, HTML/CSS, Git, AWS, Docker",
        idioma: "Ex: English",
        certificacao: "Ex: AWS Cloud Practitioner Certification"
      },
      botoes: {
        adicionarExperiencia: "Add Experience",
        adicionarFormacao: "Add Education",
        adicionarIdioma: "Add Language",
        adicionarCertificacao: "Add Certification",
        gerarCV: "Generate PDF Resume"
      },
      mensagens: {
        nenhumaExperiencia: "No experience added (optional)",
        nenhumIdioma: "No languages added (optional)",
        nenhumaCertificacao: "No certifications added (optional)",
        sucesso: "Resume generated successfully!",
        gerando: "Generating Resume..."
      },
      secoesPDF: {
        resumo: "SUMMARY",
        experiencia: "EXPERIENCE",
        formacao: "EDUCATION",
        habilidades: "SKILLS",
        idiomas: "LANGUAGES",
        certificacoes: "CERTIFICATIONS"
      },
      niveisIdioma: [
        "Basic", "Intermediate", "Advanced", "Fluent", "Native"
      ]
    },
    es: {
      tituloApp: "Generador de Currículum",
      subtituloApp: "Crea un currículum minimalista y optimizado para ATS",
      dicasATS: "Consejos para un currículum compatible con ATS",
      dicasLista: [
        "Usa palabras clave relevantes para el puesto",
        "Mantén el formato simple y legible",
        "Incluye métricas y resultados concretos",
        "Destaca tus principales habilidades técnicas"
      ],
      campos: {
        nome: "Nombre Completo*",
        cargoDesejado: "Puesto Deseado",
        codigoPais: "Código de País",
        ddd: "Código de Área",
        telefone: "Teléfono",
        cidade: "Ciudad",
        linkedin: "LinkedIn",
        portfolio: "Portfolio/GitHub",
        email: "Email*",
        resumo: "Resumen Profesional*",
        experiencia: "Experiencia Profesional",
        formacao: "Formación Académica",
        habilidades: "Habilidades Técnicas",
        idiomas: "Idiomas",
        certificacoes: "Certificaciones",
        tipoFormacao: "Nivel de Formación",
        curso: "Curso*",
        instituicao: "Institución*",
        periodo: "Período",
        cargo: "Puesto",
        empresa: "Empresa",
        tecnologias: "Tecnologías utilizadas",
        atividades: "Responsabilidades",
        resultados: "Logros (con métricas)",
        idioma: "Idioma",
        nivel: "Nivel",
        certificacao: "Certificación"
      },
      placeholders: {
        nome: "Ej: Juan Pérez",
        cargoDesejado: "Ej: Desarrollador Front-end React",
        ddd: "Ej: 11",
        telefone: "Ej: 99999-9999",
        cidade: "Ej: Madrid, España",
        linkedin: "tuperfil",
        portfolio: "Ej: github.com/tuusuario",
        email: "Ej: tu.email@ejemplo.com",
        resumo: "Ej: Desarrollador Front-end con 5 años de experiencia...",
        curso: "Ej: Licenciatura en Informática",
        instituicao: "Ej: Universidad de São Paulo",
        periodo: "Ej: 2015 - 2019",
        cargo: "Ej: Desarrollador Front-end React",
        empresa: "Ej: Google Inc.",
        tecnologias: "Ej: React, TypeScript, Redux, Node.js",
        atividades: "Describe tus responsabilidades (1 ítem por línea)",
        resultados: "Ej: Reduje el tiempo de carga en 40% mediante...",
        habilidades: "Ej: JavaScript, React, Node.js, HTML/CSS, Git, AWS, Docker",
        idioma: "Ej: Inglés",
        certificacao: "Ej: Certificación AWS Cloud Practitioner"
      },
      botoes: {
        adicionarExperiencia: "Añadir Experiencia",
        adicionarFormacao: "Añadir Formación",
        adicionarIdioma: "Añadir Idioma",
        adicionarCertificacao: "Añadir Certificación",
        gerarCV: "Generar CV en PDF"
      },
      mensagens: {
        nenhumaExperiencia: "Ninguna experiencia añadida (opcional)",
        nenhumIdioma: "Ningún idioma añadido (opcional)",
        nenhumaCertificacao: "Ninguna certificación añadida (opcional)",
        sucesso: "¡Currículum generado con éxito!",
        gerando: "Generando Currículum..."
      },
      secoesPDF: {
        resumo: "RESUMEN",
        experiencia: "EXPERIENCIA",
        formacao: "FORMACIÓN",
        habilidades: "HABILIDADES",
        idiomas: "IDIOMAS",
        certificacoes: "CERTIFICACIONES"
      },
      niveisIdioma: [
        "Básico", "Intermedio", "Avanzado", "Fluido", "Nativo"
      ]
    }
  };

  const paisesTelefone = [
    { codigo: "+55", nome: "Brasil (+55)" },
    { codigo: "+1", nome: "EUA/Canadá (+1)" },
    { codigo: "+54", nome: "Argentina (+54)" },
    { codigo: "+351", nome: "Portugal (+351)" },
    { codigo: "+34", nome: "Espanha (+34)" },
    { codigo: "+49", nome: "Alemanha (+49)" },
    { codigo: "+33", nome: "França (+33)" },
    { codigo: "+44", nome: "Reino Unido (+44)" },
    { codigo: "+39", nome: "Itália (+39)" },
    { codigo: "+61", nome: "Austrália (+61)" }
  ];

  const tiposCurso = [
    { valor: "superior", label: "Ensino Superior" },
    { valor: "tecnologo", label: "Tecnólogo" },
    { valor: "medio", label: "Ensino Médio" },
    { valor: "tecnico", label: "Técnico" },
    { valor: "pos", label: "Pós-Graduação" },
    { valor: "mestrado", label: "Mestrado" },
    { valor: "doutorado", label: "Doutorado" },
    { valor: "outro", label: "Outro" }
  ];

  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    ddd: "",
    codigoPais: "+55",
    cidade: "",
    email: "",
    linkedin: "",
    portfolio: "",
    cargoDesejado: "",
    resumo: "",
    experiencias: [],
    formacoes: [{ tipo: "superior", curso: "", instituicao: "", periodo: "" }],
    habilidades: [],
    certificacoes: [],
    idiomas: [{ idioma: "", nivel: "" }],
  });

  const [errors, setErrors] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [habilidadesInput, setHabilidadesInput] = useState("");
  const [idiomaApp, setIdiomaApp] = useState("pt");

  // Obter textos traduzidos com base no idioma selecionado
  const t = textos[idiomaApp];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nome.trim()) newErrors.nome = t.campos.nome.replace("*", "") + " é obrigatório";
    if (!formData.email.trim()) newErrors.email = t.campos.email.replace("*", "") + " é obrigatório";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Email inválido";
    
    if (!formData.resumo.trim()) newErrors.resumo = t.campos.resumo.replace("*", "") + " é obrigatório";
    
    formData.formacoes.forEach((form, idx) => {
      if (!form.curso.trim()) newErrors[`formacao_curso_${idx}`] = t.campos.curso.replace("*", "") + " é obrigatório";
      if (!form.instituicao.trim()) newErrors[`formacao_instituicao_${idx}`] = t.campos.instituicao.replace("*", "") + " é obrigatória";
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, index, name, value) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = { ...newArray[index], [name]: value };
      return { ...prev, [field]: newArray };
    });
  };

  const addField = (field, initialValue = "") => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], typeof initialValue === "object" ? { ...initialValue } : initialValue]
    }));
  };

  const removeField = (field, index) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray.splice(index, 1);
      return { ...prev, [field]: newArray };
    });
  };

  const handleHabilidadesChange = (e) => {
    const value = e.target.value;
    setHabilidadesInput(value);
    
    const habilidadesArray = value.split(",")
      .map(skill => skill.trim())
      .filter(skill => skill);
    
    setFormData(prev => ({ ...prev, habilidades: habilidadesArray }));
  };

  const formatarTextoParaPDF = (text, maxWidth, font, fontSize) => {
    const words = text.split(' ');
    let lines = [];
    let currentLine = words[0] || '';

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine + ' ' + word;
      const width = font.widthOfTextAtSize(testLine, fontSize);
      
      if (width < maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }

    lines.push(currentLine);
    return lines;
  };

  const gerarPDF = async () => {
    if (!validateForm()) return;
    
    setIsGenerating(true);
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595, 842]); // A4
      const { width, height } = page.getSize();
      
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      // Cores em preto com variações de tonalidade
      const black = rgb(0, 0, 0);
      const darkGray = rgb(0.3, 0.3, 0.3);
      const mediumGray = rgb(0.5, 0.5, 0.5);
      const lightGray = rgb(0.8, 0.8, 0.8);
      
      // Margens generosas para impressão
      const marginX = 50;
      const marginY = 50;
      const maxWidth = width - 2 * marginX;
      let y = height - marginY;
      
      // Espaçamento ampliado
      const lineHeight = 16;
      const sectionGap = 20;
      const paragraphGap = 8;
      
      // Funções auxiliares para desenhar texto
      const drawTitle = (text, size = 16, color = black) => {
        page.drawText(text, {
          x: marginX,
          y,
          size,
          font: boldFont,
          color,
          lineHeight: size * 1.2
        });
        y -= size + 8;
      };
      
      const drawSubtitle = (text, size = 12, color = darkGray) => {
        page.drawText(text, {
          x: marginX,
          y,
          size,
          font: boldFont,
          color,
          lineHeight: size * 1.2
        });
        y -= size + 6;
      };
      
      const drawText = (text, indent = 0, size = 11, maxWidthOverride = maxWidth, color = black) => {
        const lines = Array.isArray(text) ? text : [text];
        lines.forEach(line => {
          if (line.trim()) {
            const formattedLines = formatarTextoParaPDF(line, maxWidthOverride - indent, font, size);
            formattedLines.forEach(formattedLine => {
              page.drawText(formattedLine, {
                x: marginX + indent,
                y,
                size,
                font,
                color,
                lineHeight: size * 1.4
              });
              y -= lineHeight;
            });
          }
        });
      };
      
      const drawBullet = (text, indent = 15, size = 11) => {
        page.drawText("•", {
          x: marginX,
          y: y + 4,
          size: size + 2,
          font,
          color: black,
        });
        drawText(text, indent, size);
      };
      
      const drawDivider = () => {
        page.drawLine({
          start: { x: marginX, y: y + sectionGap/2 },
          end: { x: width - marginX, y: y + sectionGap/2 },
          thickness: 0.5,
          color: lightGray,
        });
        y -= sectionGap;
      };
      
      // Cabeçalho minimalista
      drawTitle(formData.nome.toUpperCase(), 20);
      
      // Cargo desejado em negrito
      if (formData.cargoDesejado) {
        drawSubtitle(formData.cargoDesejado, 14);
        y -= 4;
      }
      
      // Informações de contato
      let contactInfo = [];
      
      // Telefone formatado
      if (formData.telefone) {
        let telefoneFormatado = '';
        if (formData.codigoPais) telefoneFormatado += `${formData.codigoPais} `;
        if (formData.ddd) telefoneFormatado += `(${formData.ddd}) `;
        telefoneFormatado += formData.telefone;
        contactInfo.push(telefoneFormatado);
      }
      
      if (formData.email) contactInfo.push(formData.email);
      if (formData.linkedin) contactInfo.push(`linkedin.com/in/${formData.linkedin}`);
      if (formData.portfolio) contactInfo.push(formData.portfolio);
      if (formData.cidade) contactInfo.push(formData.cidade);
      
      drawText(contactInfo.join(" • "), 0, 10, maxWidth, mediumGray);
      drawDivider();
      
      // Resumo Profissional
      if (formData.resumo) {
        drawTitle(t.secoesPDF.resumo, 14);
        drawText(formData.resumo, 0, 11);
        drawDivider();
      }
      
      // Experiência Profissional
      if (formData.experiencias.length > 0) {
        drawTitle(t.secoesPDF.experiencia, 14);
        
        formData.experiencias.forEach(exp => {
          if (exp.cargo || exp.empresa) {
            let title = [];
            if (exp.cargo) title.push(exp.cargo);
            if (exp.empresa) title.push(` | ${exp.empresa}`);
            if (exp.periodo) title.push(` (${exp.periodo})`);
            
            drawSubtitle(title.join(""), 12);
            
            if (exp.tecnologias) {
              drawText(`${t.campos.tecnologias}: ${exp.tecnologias}`, 0, 10, maxWidth, mediumGray);
              y -= paragraphGap;
            }
            
            if (exp.atividades) {
              const atividades = exp.atividades.split('\n').filter(a => a.trim());
              atividades.forEach(atividade => {
                drawBullet(atividade.trim());
              });
              y -= paragraphGap;
            }
            
            if (exp.resultados) {
              const resultados = exp.resultados.split('\n').filter(r => r.trim());
              resultados.forEach(resultado => {
                drawBullet(resultado.trim());
              });
            }
            
            y -= 10; // Espaço extra entre experiências
          }
        });
        drawDivider();
      }
      
      // Formação Acadêmica
      if (formData.formacoes.some(form => form.curso || form.instituicao)) {
        drawTitle(t.secoesPDF.formacao, 14);
        
        formData.formacoes.forEach(form => {
          if (form.curso || form.instituicao) {
            const tipoCurso = tiposCurso.find(t => t.valor === form.tipo)?.label || '';
            let title = [];
            if (tipoCurso) title.push(`${tipoCurso} - `);
            if (form.curso) title.push(form.curso);
            if (form.instituicao) title.push(` | ${form.instituicao}`);
            if (form.periodo) title.push(` (${form.periodo})`);
            
            drawBullet(title.join(""));
          }
        });
        drawDivider();
      }
      
      // Habilidades Técnicas
      if (formData.habilidades.length > 0) {
        drawTitle(t.secoesPDF.habilidades, 14);
        drawText(formData.habilidades.join(", "), 0, 11);
        drawDivider();
      }
      
      // Idiomas
      if (formData.idiomas.some(i => i.idioma)) {
        drawTitle(t.secoesPDF.idiomas, 14);
        
        formData.idiomas.forEach(idioma => {
          if (idioma.idioma) {
            let text = idioma.idioma;
            if (idioma.nivel) text += ` (${idioma.nivel})`;
            drawBullet(text);
          }
        });
        drawDivider();
      }
      
      // Certificações
      if (formData.certificacoes.length > 0) {
        drawTitle(t.secoesPDF.certificacoes, 14);
        
        formData.certificacoes.forEach(cert => {
          if (cert.trim()) drawBullet(cert);
        });
      }
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `CV_${formData.nome.replace(/\s+/g, '_')}.pdf`;
      link.click();
      
      setSuccessMessage(t.mensagens.sucesso);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderExperienceFields = () => {
    return formData.experiencias.map((exp, idx) => (
      <div key={idx} className="mb-8 p-6 border border-gray-200 rounded-lg relative bg-white shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.campos.cargo}</label>
            <input
              type="text"
              value={exp.cargo}
              onChange={(e) => handleArrayChange("experiencias", idx, "cargo", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
              placeholder={t.placeholders.cargo}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.campos.empresa}</label>
            <input
              type="text"
              value={exp.empresa}
              onChange={(e) => handleArrayChange("experiencias", idx, "empresa", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
              placeholder={t.placeholders.empresa}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.campos.periodo}</label>
            <input
              type="text"
              value={exp.periodo}
              onChange={(e) => handleArrayChange("experiencias", idx, "periodo", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
              placeholder={t.placeholders.periodo}
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">{t.campos.tecnologias}</label>
          <input
            type="text"
            value={exp.tecnologias}
            onChange={(e) => handleArrayChange("experiencias", idx, "tecnologias", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
            placeholder={t.placeholders.tecnologias}
          />
          <p className="text-xs text-gray-500 mt-2">{t.placeholders.tecnologias.split(":")[0]}</p>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">{t.campos.atividades}</label>
          <textarea
            value={exp.atividades}
            onChange={(e) => handleArrayChange("experiencias", idx, "atividades", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
            rows={3}
            placeholder={t.placeholders.atividades}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t.campos.resultados}</label>
          <textarea
            value={exp.resultados}
            onChange={(e) => handleArrayChange("experiencias", idx, "resultados", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
            rows={3}
            placeholder={t.placeholders.resultados}
          />
          <p className="text-xs text-gray-500 mt-2">{t.placeholders.resultados.split(":")[0]}</p>
        </div>
        
        <button
          type="button"
          onClick={() => removeField("experiencias", idx)}
          className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
          title="Remover experiência"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    ));
  };

  const renderEducationFields = () => {
    return formData.formacoes.map((form, idx) => (
      <div key={idx} className="mb-6 p-6 border border-gray-200 rounded-lg relative bg-white shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.campos.tipoFormacao}</label>
            <select
              value={form.tipo}
              onChange={(e) => handleArrayChange("formacoes", idx, "tipo", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
            >
              {tiposCurso.map(tipo => (
                <option key={tipo.valor} value={tipo.valor}>{tipo.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.campos.curso}</label>
            <input
              type="text"
              value={form.curso}
              onChange={(e) => handleArrayChange("formacoes", idx, "curso", e.target.value)}
              className={`w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black ${
                errors[`formacao_curso_${idx}`] ? "border-red-500" : ""
              }`}
              placeholder={t.placeholders.curso}
            />
            {errors[`formacao_curso_${idx}`] && (
              <p className="text-red-500 text-xs mt-2">{errors[`formacao_curso_${idx}`]}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.campos.instituicao}</label>
            <input
              type="text"
              value={form.instituicao}
              onChange={(e) => handleArrayChange("formacoes", idx, "instituicao", e.target.value)}
              className={`w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black ${
                errors[`formacao_instituicao_${idx}`] ? "border-red-500" : ""
              }`}
              placeholder={t.placeholders.instituicao}
            />
            {errors[`formacao_instituicao_${idx}`] && (
              <p className="text-red-500 text-xs mt-2">{errors[`formacao_instituicao_${idx}`]}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.campos.periodo}</label>
            <input
              type="text"
              value={form.periodo}
              onChange={(e) => handleArrayChange("formacoes", idx, "periodo", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
              placeholder={t.placeholders.periodo}
            />
          </div>
        </div>
        
        {formData.formacoes.length > 1 && (
          <button
            type="button"
            onClick={() => removeField("formacoes", idx)}
            className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
            title="Remover formação"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
</svg>
</button>
)}
</div>
));
};

const renderLanguageFields = () => {
return formData.idiomas.map((idioma, idx) => (
<div key={idx} className="mb-6 p-6 border border-gray-200 rounded-lg relative bg-white shadow-sm">
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">{t.campos.idioma}</label>
<input
type="text"
value={idioma.idioma}
onChange={(e) => handleArrayChange("idiomas", idx, "idioma", e.target.value)}
className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
placeholder={t.placeholders.idioma}
/>
</div>
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">{t.campos.nivel}</label>
<select
value={idioma.nivel}
onChange={(e) => handleArrayChange("idiomas", idx, "nivel", e.target.value)}
className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
>
<option value="">{t.campos.nivel}</option>
{t.niveisIdioma.map((nivel, i) => (
<option key={i} value={nivel}>{nivel}</option>
))}
</select>
</div>
</div>

    {formData.idiomas.length > 1 && (
      <button
        type="button"
        onClick={() => removeField("idiomas", idx)}
        className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
        title="Remover idioma"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </button>
    )}
  </div>
));

};

return (
<div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
<div className="max-w-5xl mx-auto">
<div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border border-gray-200">
{/* Cabeçalho minimalista */}
<div className="bg-black p-8 text-white">
<div className="flex justify-between items-start">
<div>
<h1 className="text-3xl font-bold">{t.tituloApp}</h1>
<p className="mt-2 opacity-90">{t.subtituloApp}</p>
</div>
<div className="relative">
<select
value={idiomaApp}
onChange={(e) => setIdiomaApp(e.target.value)}
className="bg-black text-white border border-gray-400 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-white"
>
{idiomasApp.map((idioma) => (
<option key={idioma.codigo} value={idioma.codigo}>
{idioma.nome}
</option>
))}
</select>
</div>
</div>
</div>

      {/* Dicas ATS */}
      <div className="p-6 bg-gray-100 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          {t.dicasATS}
        </h2>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          {t.dicasLista.map((dica, index) => (
            <li key={index}>{dica}</li>
          ))}
        </ul>
      </div>
      
      <form onSubmit={(e) => { e.preventDefault(); gerarPDF(); }} className="p-6 space-y-8">
        {successMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p>{successMessage}</p>
            </div>
          </div>
        )}
        
        {/* Seção de Informações Pessoais */}
        <div className="border-b border-gray-200 pb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {t.campos.nome.split("*")[0]}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.campos.nome}</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className={`w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black ${
                  errors.nome ? "border-red-500" : ""
                }`}
                placeholder={t.placeholders.nome}
              />
              {errors.nome && <p className="text-red-500 text-xs mt-2">{errors.nome}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.campos.cargoDesejado}</label>
              <input
                type="text"
                name="cargoDesejado"
                value={formData.cargoDesejado}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
                placeholder={t.placeholders.cargoDesejado}
              />
            </div>
          </div>
          
          {/* Telefone com DDD e código do país */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.campos.codigoPais}</label>
              <select
                name="codigoPais"
                value={formData.codigoPais}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
              >
                {paisesTelefone.map(pais => (
                  <option key={pais.codigo} value={pais.codigo}>{pais.nome}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.campos.ddd}</label>
              <input
                type="text"
                name="ddd"
                value={formData.ddd}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
                placeholder={t.placeholders.ddd}
                maxLength="2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.campos.telefone}</label>
              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
                placeholder={t.placeholders.telefone}
              />
            </div>
          </div>
          
          {/* Cidade, LinkedIn e Portfolio */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.campos.cidade}</label>
              <input
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
                placeholder={t.placeholders.cidade}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.campos.linkedin}</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-100 text-gray-500 text-sm">
                  linkedin.com/in/
                </span>
                <input
                  type="text"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="flex-1 min-w-0 block w-full p-3 rounded-none rounded-r-md border border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
                  placeholder={t.placeholders.linkedin}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.campos.portfolio}</label>
              <input
                type="text"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
                placeholder={t.placeholders.portfolio}
              />
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.campos.email}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black ${
                errors.email ? "border-red-500" : ""
              }`}
              placeholder={t.placeholders.email}
            />
            {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email}</p>}
          </div>
        </div>
        
        {/* Resumo Profissional */}
        <div className="border-b border-gray-200 pb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {t.campos.resumo}
          </h2>
          <textarea
            name="resumo"
            value={formData.resumo}
            onChange={handleChange}
            className={`w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black ${
              errors.resumo ? "border-red-500" : ""
            }`}
            rows={5}
            placeholder={t.placeholders.resumo}
          />
          {errors.resumo && <p className="text-red-500 text-xs mt-2">{errors.resumo}</p>}
          <p className="text-xs text-gray-500 mt-3">{t.placeholders.resumo.split(":")[0]}</p>
        </div>
        
        {/* Experiência Profissional (opcional) */}
        <div className="border-b border-gray-200 pb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {t.campos.experiencia}
            </h2>
            <button
              type="button"
              onClick={() => addField("experiencias", { cargo: "", empresa: "", periodo: "", tecnologias: "", atividades: "", resultados: "" })}
              className="flex items-center text-black hover:text-white hover:bg-black text-sm font-medium border border-black px-4 py-2 rounded-md transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              {t.botoes.adicionarExperiencia}
            </button>
          </div>
          
          {formData.experiencias.length > 0 ? (
            renderExperienceFields()
          ) : (
            <p className="text-sm text-gray-500 italic">{t.mensagens.nenhumaExperiencia}</p>
          )}
        </div>
        
        {/* Formação Acadêmica */}
        <div className="border-b border-gray-200 pb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {t.campos.formacao}
            </h2>
            <button
              type="button"
              onClick={() => addField("formacoes", { tipo: "superior", curso: "", instituicao: "", periodo: "" })}
              className="flex items-center text-black hover:text-white hover:bg-black text-sm font-medium border border-black px-4 py-2 rounded-md transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              {t.botoes.adicionarFormacao}
            </button>
          </div>
          
          {renderEducationFields()}
        </div>
        
        {/* Habilidades Técnicas */}
        <div className="border-b border-gray-200 pb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {t.campos.habilidades}
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.placeholders.habilidades.split(":")[0]}</label>
            <input
              type="text"
              value={habilidadesInput}
              onChange={handleHabilidadesChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
              placeholder={t.placeholders.habilidades}
            />
            <p className="text-xs text-gray-500 mt-3">{t.placeholders.habilidades.split(":")[0]}</p>
            
            {/* Preview das habilidades */}
            {formData.habilidades.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Pré-visualização:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.habilidades.map((skill, idx) => (
                    <span key={idx} className="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Idiomas */}
        <div className="border-b border-gray-200 pb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {t.campos.idiomas}
            </h2>
            <button
              type="button"
              onClick={() => addField("idiomas", { idioma: "", nivel: "" })}
              className="flex items-center text-black hover:text-white hover:bg-black text-sm font-medium border border-black px-4 py-2 rounded-md transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              {t.botoes.adicionarIdioma}
            </button>
          </div>
          
          {formData.idiomas.length > 0 ? (
            renderLanguageFields()
          ) : (
            <p className="text-sm text-gray-500 italic">{t.mensagens.nenhumIdioma}</p>
          )}
        </div>
        
        {/* Certificações (opcional) */}
        <div className="pb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {t.campos.certificacoes}
            </h2>
            <button
              type="button"
              onClick={() => addField("certificacoes", "")}
              className="flex items-center text-black hover:text-white hover:bg-black text-sm font-medium border border-black px-4 py-2 rounded-md transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              {t.botoes.adicionarCertificacao}
            </button>
          </div>
          
          {formData.certificacoes.length > 0 ? (
            formData.certificacoes.map((cert, idx) => (
              <div key={idx} className="mb-6 p-6 border border-gray-200 rounded-lg relative bg-white shadow-sm">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.campos.certificacao}</label>
                  <input
                    type="text"
                    value={cert}
                    onChange={(e) => {
                      const newCerts = [...formData.certificacoes];
                      newCerts[idx] = e.target.value;
                      setFormData(prev => ({ ...prev, certificacoes: newCerts }));
                    }}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
                    placeholder={t.placeholders.certificacao}
                  />
                </div>
                
                <button
                  type="button"
                  onClick={() => removeField("certificacoes", idx)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
                  title="Remover certificação"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">{t.mensagens.nenhumaCertificacao}</p>
          )}
        </div>
        
        {/* Botão de envio */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isGenerating}
            className={`px-10 py-4 rounded-lg text-white font-medium text-lg flex items-center transition-all ${
              isGenerating ? "bg-gray-500 cursor-not-allowed" : "bg-black hover:bg-gray-800 shadow-md hover:shadow-lg"
            }`}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t.mensagens.gerando}
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t.botoes.gerarCV}
              </>
            )}
          </button>
        </div>

        {/* Footer adicionado */}
        <footer className="max-w-5xl mx-auto w-full py-6">
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="flex space-x-4">
              <a 
                href="https://github.com/codedgabriel/ats-curriculo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-black transition-colors"
                aria-label="GitHub do projeto"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              </a>
              <a 
                href="https://linkedin.com/in/codegabriel" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 transition-colors"
                aria-label="LinkedIn do autor"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
            <p className="text-sm text-gray-500">
              Criado por <span className="font-medium">D. Gabriel</span>
            </p>
          </div>
        </footer>
      </form>
    </div>
  </div>
</div>

);
}

export default App;