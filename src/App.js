import { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

function App() {
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório";
    if (!formData.email.trim()) newErrors.email = "Email é obrigatório";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Email inválido";
    
    if (!formData.resumo.trim()) newErrors.resumo = "Resumo profissional é obrigatório";
    
    formData.formacoes.forEach((form, idx) => {
      if (!form.curso.trim()) newErrors[`formacao_curso_${idx}`] = "Curso é obrigatório";
      if (!form.instituicao.trim()) newErrors[`formacao_instituicao_${idx}`] = "Instituição é obrigatória";
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
      
      const textColor = rgb(0.1, 0.1, 0.1); // Preto mais suave
      const primaryColor = rgb(0.2, 0.4, 0.6); // Azul profissional
      const lightGray = rgb(0.9, 0.9, 0.9);
      const darkGray = rgb(0.5, 0.5, 0.5);
      
      // Margens e espaçamento ampliados
      const marginX = 50;
      const marginY = 50;
      const maxWidth = width - 2 * marginX;
      let y = height - marginY;
      const lineHeight = 16; // Aumentado
      const sectionGap = 20; // Aumentado
      const paragraphGap = 10; // Aumentado
      const bulletIndent = 20;
      
      // Funções auxiliares para desenhar texto com espaçamento ampliado
      const drawTitle = (text, size = 18, color = primaryColor) => {
        page.drawText(text, {
          x: marginX,
          y,
          size,
          font: boldFont,
          color,
        });
        y -= size + 8; // Espaçamento aumentado
      };
      
      const drawSubtitle = (text, size = 14, color = darkGray) => {
        page.drawText(text, {
          x: marginX,
          y,
          size,
          font: boldFont,
          color,
        });
        y -= size + 6; // Espaçamento aumentado
      };
      
      const drawText = (text, indent = 0, size = 12, maxWidthOverride = maxWidth, color = textColor) => {
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
              });
              y -= lineHeight;
            });
          }
        });
      };
      
      const drawBullet = (text, indent = bulletIndent, size = 12) => {
        page.drawText("•", {
          x: marginX,
          y: y + 4,
          size: size + 2,
          font,
          color: primaryColor,
        });
        drawText(text, indent, size);
      };
      
      const drawDivider = () => {
        page.drawLine({
          start: { x: marginX, y: y + sectionGap/2 },
          end: { x: width - marginX, y: y + sectionGap/2 },
          thickness: 1,
          color: lightGray,
        });
        y -= sectionGap;
      };
      
      // Cabeçalho com espaçamento ampliado
      drawTitle(formData.nome.toUpperCase(), 22);
      y -= 10; // Espaço extra após o nome
      
      // Informações de contato
      let contactInfo = [];
      if (formData.cargoDesejado) contactInfo.push(formData.cargoDesejado);
      
      // Telefone formatado
      if (formData.telefone) {
        let telefoneFormatado = '';
        if (formData.codigoPais) telefoneFormatado += `${formData.codigoPais} `;
        if (formData.ddd) telefoneFormatado += `(${formData.ddd}) `;
        telefoneFormatado += formData.telefone;
        contactInfo.push(telefoneFormatado);
      }
      
      if (formData.email) contactInfo.push(formData.email);
      if (formData.linkedin) contactInfo.push(`LinkedIn: ${formData.linkedin}`);
      if (formData.portfolio) contactInfo.push(`Portfolio: ${formData.portfolio}`);
      if (formData.cidade) contactInfo.push(formData.cidade);
      
      drawText(contactInfo.join(" | "), 0, 12, maxWidth, darkGray);
      drawDivider();
      
      // Resumo Profissional com espaçamento ampliado
      if (formData.resumo) {
        drawTitle("RESUMO PROFISSIONAL");
        y -= 5; // Espaço extra antes do texto
        drawText(formData.resumo, 0, 12);
        drawDivider();
      }
      
      // Experiência Profissional com espaçamento ampliado
      if (formData.experiencias.length > 0) {
        drawTitle("EXPERIÊNCIA PROFISSIONAL");
        y -= 5; // Espaço extra antes dos itens
        
        formData.experiencias.forEach(exp => {
          if (exp.cargo || exp.empresa) {
            let title = [];
            if (exp.cargo) title.push(exp.cargo);
            if (exp.empresa) title.push(` | ${exp.empresa}`);
            if (exp.periodo) title.push(` (${exp.periodo})`);
            
            drawSubtitle(title.join(""));
            y -= 4; // Espaço extra após o título
            
            if (exp.tecnologias) {
              drawText(`Tecnologias: ${exp.tecnologias}`, 0, 11, maxWidth, darkGray);
              y -= paragraphGap + 4; // Espaço extra
            }
            
            if (exp.atividades) {
              const atividades = exp.atividades.split('\n').filter(a => a.trim());
              atividades.forEach(atividade => {
                drawBullet(atividade);
              });
              y -= paragraphGap;
            }
            
            if (exp.resultados) {
              drawSubtitle("Principais Resultados:", 12);
              y -= 4; // Espaço extra
              const resultados = exp.resultados.split('\n').filter(r => r.trim());
              resultados.forEach(resultado => {
                drawBullet(resultado);
              });
            }
            
            y -= sectionGap/2 + 5; // Espaço extra entre experiências
          }
        });
        drawDivider();
      }
      
      // Formação Acadêmica com espaçamento ampliado
      if (formData.formacoes.some(form => form.curso || form.instituicao)) {
        drawTitle("FORMAÇÃO ACADÊMICA");
        y -= 5; // Espaço extra antes dos itens
        
        formData.formacoes.forEach(form => {
          if (form.curso || form.instituicao) {
            const tipoCurso = tiposCurso.find(t => t.valor === form.tipo)?.label || '';
            let title = [];
            if (tipoCurso) title.push(`${tipoCurso} - `);
            if (form.curso) title.push(form.curso);
            if (form.instituicao) title.push(` | ${form.instituicao}`);
            if (form.periodo) title.push(` (${form.periodo})`);
            
            drawBullet(title.join(""));
            y -= 4; // Espaço extra entre formações
          }
        });
        drawDivider();
      }
      
      // Habilidades Técnicas com espaçamento ampliado
      if (formData.habilidades.length > 0) {
        drawTitle("HABILIDADES TÉCNICAS");
        y -= 5; // Espaço extra antes do texto
        drawText(formData.habilidades.join(", "), 0, 12);
        drawDivider();
      }
      
      // Idiomas com espaçamento ampliado
      if (formData.idiomas.some(i => i.idioma)) {
        drawTitle("IDIOMAS");
        y -= 5; // Espaço extra antes dos itens
        
        formData.idiomas.forEach(idioma => {
          if (idioma.idioma) {
            let text = idioma.idioma;
            if (idioma.nivel) text += ` (${idioma.nivel})`;
            drawBullet(text);
            y -= 4; // Espaço extra entre idiomas
          }
        });
        drawDivider();
      }
      
      // Certificações com espaçamento ampliado
      if (formData.certificacoes.length > 0) {
        drawTitle("CERTIFICAÇÕES");
        y -= 5; // Espaço extra antes dos itens
        
        formData.certificacoes.forEach(cert => {
          if (cert.trim()) drawBullet(cert);
          y -= 4; // Espaço extra entre certificações
        });
      }
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `CV_${formData.nome.replace(/\s+/g, '_')}.pdf`;
      link.click();
      
      setSuccessMessage("Currículo gerado com sucesso!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderExperienceFields = () => {
    return formData.experiencias.map((exp, idx) => (
      <div key={idx} className="mb-8 p-6 border border-gray-300 rounded-lg relative bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cargo</label>
            <input
              type="text"
              value={exp.cargo}
              onChange={(e) => handleArrayChange("experiencias", idx, "cargo", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Desenvolvedor Front-end React"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Empresa</label>
            <input
              type="text"
              value={exp.empresa}
              onChange={(e) => handleArrayChange("experiencias", idx, "empresa", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Google Inc."
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
            <input
              type="text"
              value={exp.periodo}
              onChange={(e) => handleArrayChange("experiencias", idx, "periodo", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Jan 2020 - Presente"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Tecnologias utilizadas</label>
          <input
            type="text"
            value={exp.tecnologias}
            onChange={(e) => handleArrayChange("experiencias", idx, "tecnologias", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ex: React | TypeScript | Redux | Node.js"
          />
          <p className="text-xs text-gray-500 mt-2">Liste as tecnologias separadas por | (pipe)</p>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Atividades realizadas</label>
          <textarea
            value={exp.atividades}
            onChange={(e) => handleArrayChange("experiencias", idx, "atividades", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Descreva suas responsabilidades (1 item por linha)"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Resultados alcançados (com métricas)</label>
          <textarea
            value={exp.resultados}
            onChange={(e) => handleArrayChange("experiencias", idx, "resultados", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Ex: Reduzi o tempo de carregamento em 40% através de..."
          />
          <p className="text-xs text-gray-500 mt-2">Inclua números e impactos concretos (1 item por linha)</p>
        </div>
        
        <button
          type="button"
          onClick={() => removeField("experiencias", idx)}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
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
      <div key={idx} className="mb-6 p-6 border border-gray-300 rounded-lg relative bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Formação</label>
            <select
              value={form.tipo}
              onChange={(e) => handleArrayChange("formacoes", idx, "tipo", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {tiposCurso.map(tipo => (
                <option key={tipo.valor} value={tipo.valor}>{tipo.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Curso*</label>
            <input
              type="text"
              value={form.curso}
              onChange={(e) => handleArrayChange("formacoes", idx, "curso", e.target.value)}
              className={`w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors[`formacao_curso_${idx}`] ? "border-red-500" : ""
              }`}
              placeholder="Ex: Bacharelado em Ciência da Computação"
            />
            {errors[`formacao_curso_${idx}`] && (
              <p className="text-red-500 text-xs mt-2">{errors[`formacao_curso_${idx}`]}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instituição*</label>
            <input
              type="text"
              value={form.instituicao}
              onChange={(e) => handleArrayChange("formacoes", idx, "instituicao", e.target.value)}
              className={`w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors[`formacao_instituicao_${idx}`] ? "border-red-500" : ""
              }`}
              placeholder="Ex: Universidade de São Paulo"
            />
            {errors[`formacao_instituicao_${idx}`] && (
              <p className="text-red-500 text-xs mt-2">{errors[`formacao_instituicao_${idx}`]}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
            <input
              type="text"
              value={form.periodo}
              onChange={(e) => handleArrayChange("formacoes", idx, "periodo", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: 2015 - 2019"
            />
          </div>
        </div>
        
        {formData.formacoes.length > 1 && (
          <button
            type="button"
            onClick={() => removeField("formacoes", idx)}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
            title="Remover formação"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    ));
  };

  const renderLanguageFields = () => {
    return formData.idiomas.map((idioma, idx) => (
      <div key={idx} className="mb-6 p-6 border border-gray-300 rounded-lg relative bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
            <input
              type="text"
              value={idioma.idioma}
              onChange={(e) => handleArrayChange("idiomas", idx, "idioma", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Inglês"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nível</label>
            <select
              value={idioma.nivel}
              onChange={(e) => handleArrayChange("idiomas", idx, "nivel", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione</option>
              <option value="Básico">Básico</option>
              <option value="Intermediário">Intermediário</option>
              <option value="Avançado">Avançado</option>
              <option value="Fluente">Fluente</option>
              <option value="Nativo">Nativo</option>
            </select>
          </div>
        </div>
        
        {formData.idiomas.length > 1 && (
          <button
            type="button"
            onClick={() => removeField("idiomas", idx)}
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
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
          {/* Cabeçalho com gradiente */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
            <h1 className="text-3xl font-bold">Gerador de Currículo ATS</h1>
            <p className="mt-2 opacity-90">Preencha os campos abaixo para criar um currículo otimizado para sistemas ATS</p>
          </div>
          
          {/* Dicas ATS */}
          <div className="p-6 bg-blue-50 border-b border-blue-100">
            <h2 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Dicas para um currículo ATS-friendly
            </h2>
            <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
              <li><strong>Destaque tecnologias</strong> em cada seção relevante</li>
              <li><strong>Inclua métricas</strong> e resultados concretos</li>
              <li><strong>Use palavras-chave</strong> da descrição da vaga</li>
              <li><strong>Formato simples</strong> - sem tabelas ou elementos gráficos</li>
              <li><strong>Seja específico</strong> - evite termos genéricos</li>
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
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Informações Pessoais
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo*</label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    className={`w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.nome ? "border-red-500" : ""
                    }`}
                    placeholder="Ex: João da Silva"
                  />
                  {errors.nome && <p className="text-red-500 text-xs mt-2">{errors.nome}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cargo Desejado</label>
                  <input
                    type="text"
                    name="cargoDesejado"
                    value={formData.cargoDesejado}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Desenvolvedor Front-end React"
                  />
                </div>
              </div>
              
              {/* Telefone com DDD e código do país */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Código do País</label>
                  <select
                    name="codigoPais"
                    value={formData.codigoPais}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {paisesTelefone.map(pais => (
                      <option key={pais.codigo} value={pais.codigo}>{pais.nome}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">DDD</label>
                  <input
                    type="text"
                    name="ddd"
                    value={formData.ddd}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: 11"
                    maxLength="2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: 99999-9999"
                  />
                </div>
              </div>
              
              {/* Cidade, LinkedIn e Portfolio */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                  <input
                    type="text"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: São Paulo, SP"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-100 text-gray-500 text-sm">
                      linkedin.com/in/
                    </span>
                    <input
                      type="text"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      className="flex-1 min-w-0 block w-full p-3 rounded-none rounded-r-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="seuperfil"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio/GitHub</label>
                  <input
                    type="text"
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: github.com/seuuser"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email*</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  placeholder="Ex: seuemail@exemplo.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email}</p>}
              </div>
            </div>
            
            {/* Resumo Profissional */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Resumo Profissional*
              </h2>
              <textarea
                name="resumo"
                value={formData.resumo}
                onChange={handleChange}
                className={`w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.resumo ? "border-red-500" : ""
                }`}
                rows={5}
                placeholder="Ex: Desenvolvedor Front-end com 5 anos de experiência em React e TypeScript. Especializado em criar interfaces de usuário responsivas e acessíveis. Apaixonado por resolver problemas complexos com código limpo e eficiente."
              />
              {errors.resumo && <p className="text-red-500 text-xs mt-2">{errors.resumo}</p>}
              <p className="text-xs text-gray-500 mt-3">Dica: Inclua suas principais tecnologias, anos de experiência e especializações.</p>
            </div>
            
            {/* Experiência Profissional (opcional) */}
            <div className="border-b border-gray-200 pb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Experiência Profissional
                </h2>
                <button
                  type="button"
                  onClick={() => addField("experiencias", { cargo: "", empresa: "", periodo: "", tecnologias: "", atividades: "", resultados: "" })}
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-md transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Adicionar Experiência
                </button>
              </div>
              
              {formData.experiencias.length > 0 ? (
                renderExperienceFields()
              ) : (
                <p className="text-sm text-gray-500 italic">Nenhuma experiência adicionada (opcional)</p>
              )}
            </div>
            
            {/* Formação Acadêmica */}
            <div className="border-b border-gray-200 pb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                  Formação Acadêmica
                </h2>
                <button
                  type="button"
                  onClick={() => addField("formacoes", { tipo: "superior", curso: "", instituicao: "", periodo: "" })}
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-md transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Adicionar Formação
                </button>
              </div>
              
              {renderEducationFields()}
            </div>
            
            {/* Habilidades Técnicas */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Habilidades Técnicas
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Liste suas habilidades separadas por vírgula</label>
                <input
                  type="text"
                  value={habilidadesInput}
                  onChange={handleHabilidadesChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: JavaScript, React, Node.js, HTML/CSS, Git, AWS, Docker"
                />
                <p className="text-xs text-gray-500 mt-3">Dica: Inclua tecnologias, ferramentas e metodologias relevantes para a vaga.</p>
                
                {/* Preview das habilidades */}
                {formData.habilidades.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Pré-visualização:</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.habilidades.map((skill, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
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
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  Idiomas
                </h2>
                <button
                  type="button"
                  onClick={() => addField("idiomas", { idioma: "", nivel: "" })}
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-md transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Adicionar Idioma
                </button>
              </div>
              
              {formData.idiomas.length > 0 ? (
                renderLanguageFields()
              ) : (
                <p className="text-sm text-gray-500 italic">Nenhum idioma adicionado (opcional)</p>
              )}
            </div>
            
            {/* Certificações (opcional) */}
            <div className="pb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Certificações
                </h2>
                <button
                  type="button"
                  onClick={() => addField("certificacoes", "")}
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-md transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Adicionar Certificação
                </button>
              </div>
              
              {formData.certificacoes.length > 0 ? (
                formData.certificacoes.map((cert, idx) => (
                  <div key={idx} className="mb-6 p-6 border border-gray-300 rounded-lg relative bg-gray-50">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Certificação</label>
                      <input
                        type="text"
                        value={cert}
                        onChange={(e) => {
                          const newCerts = [...formData.certificacoes];
                          newCerts[idx] = e.target.value;
                          setFormData(prev => ({ ...prev, certificacoes: newCerts }));
                        }}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: Certificação AWS Cloud Practitioner"
                      />
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => removeField("certificacoes", idx)}
                      className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
                      title="Remover certificação"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">Nenhuma certificação adicionada (opcional)</p>
              )}
            </div>
            
            {/* Botão de envio */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isGenerating}
                className={`px-10 py-4 rounded-lg text-white font-medium text-lg flex items-center transition-all ${
                  isGenerating ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
                }`}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Gerando Currículo...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Gerar Currículo em PDF
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;