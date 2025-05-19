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
        drawTitle("RESUMO", 14);
        drawText(formData.resumo, 0, 11);
        drawDivider();
      }
      
      // Experiência Profissional
      if (formData.experiencias.length > 0) {
        drawTitle("EXPERIÊNCIA", 14);
        
        formData.experiencias.forEach(exp => {
          if (exp.cargo || exp.empresa) {
            let title = [];
            if (exp.cargo) title.push(exp.cargo);
            if (exp.empresa) title.push(` | ${exp.empresa}`);
            if (exp.periodo) title.push(` (${exp.periodo})`);
            
            drawSubtitle(title.join(""), 12);
            
            if (exp.tecnologias) {
              drawText(`Tecnologias: ${exp.tecnologias}`, 0, 10, maxWidth, mediumGray);
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
        drawTitle("FORMAÇÃO", 14);
        
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
        drawTitle("HABILIDADES", 14);
        drawText(formData.habilidades.join(", "), 0, 11);
        drawDivider();
      }
      
      // Idiomas
      if (formData.idiomas.some(i => i.idioma)) {
        drawTitle("IDIOMAS", 14);
        
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
        drawTitle("CERTIFICAÇÕES", 14);
        
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
      <div key={idx} className="mb-8 p-6 border border-gray-200 rounded-lg relative bg-white shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cargo</label>
            <input
              type="text"
              value={exp.cargo}
              onChange={(e) => handleArrayChange("experiencias", idx, "cargo", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
              placeholder="Ex: Desenvolvedor Front-end React"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Empresa</label>
            <input
              type="text"
              value={exp.empresa}
              onChange={(e) => handleArrayChange("experiencias", idx, "empresa", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
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
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
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
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
            placeholder="Ex: React, TypeScript, Redux, Node.js"
          />
          <p className="text-xs text-gray-500 mt-2">Liste as tecnologias separadas por vírgula</p>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Atividades realizadas</label>
          <textarea
            value={exp.atividades}
            onChange={(e) => handleArrayChange("experiencias", idx, "atividades", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
            rows={3}
            placeholder="Descreva suas responsabilidades (1 item por linha)"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Resultados alcançados (com métricas)</label>
          <textarea
            value={exp.resultados}
            onChange={(e) => handleArrayChange("experiencias", idx, "resultados", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
            rows={3}
            placeholder="Ex: Reduzi o tempo de carregamento em 40% através de..."
          />
          <p className="text-xs text-gray-500 mt-2">Inclua números e impactos concretos (1 item por linha)</p>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Formação</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Curso*</label>
            <input
              type="text"
              value={form.curso}
              onChange={(e) => handleArrayChange("formacoes", idx, "curso", e.target.value)}
              className={`w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black ${
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
              className={`w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black ${
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
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
              placeholder="Ex: 2015 - 2019"
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
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
            <input
              type="text"
              value={idioma.idioma}
              onChange={(e) => handleArrayChange("idiomas", idx, "idioma", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
              placeholder="Ex: Inglês"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nível</label>
            <select
              value={idioma.nivel}
              onChange={(e) => handleArrayChange("idiomas", idx, "nivel", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
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
            <h1 className="text-3xl font-bold">Gerador de Currículo</h1>
            <p className="mt-2 opacity-90">Crie um currículo minimalista e otimizado para ATS</p>
          </div>
          
          {/* Dicas ATS */}
          <div className="p-6 bg-gray-100 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Dicas para um currículo ATS-friendly
            </h2>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              <li>Use palavras-chave relevantes para a vaga</li>
              <li>Mantenha o formato simples e legível</li>
              <li>Inclua métricas e resultados concretos</li>
              <li>Destaque suas principais habilidades técnicas</li>
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
                    className={`w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black ${
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
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
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
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
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
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
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
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
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
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
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
                      className="flex-1 min-w-0 block w-full p-3 rounded-none rounded-r-md border border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
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
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
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
                  className={`w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  placeholder="Ex: seuemail@exemplo.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email}</p>}
              </div>
            </div>
            
            {/* Resumo Profissional */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Resumo Profissional*
              </h2>
              <textarea
                name="resumo"
                value={formData.resumo}
                onChange={handleChange}
                className={`w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black ${
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
                <h2 className="text-2xl font-semibold text-gray-800">
                  Experiência Profissional
                </h2>
                <button
                  type="button"
                  onClick={() => addField("experiencias", { cargo: "", empresa: "", periodo: "", tecnologias: "", atividades: "", resultados: "" })}
                  className="flex items-center text-black hover:text-white hover:bg-black text-sm font-medium border border-black px-4 py-2 rounded-md transition-colors"
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
                <h2 className="text-2xl font-semibold text-gray-800">
                  Formação Acadêmica
                </h2>
                <button
                  type="button"
                  onClick={() => addField("formacoes", { tipo: "superior", curso: "", instituicao: "", periodo: "" })}
                  className="flex items-center text-black hover:text-white hover:bg-black text-sm font-medium border border-black px-4 py-2 rounded-md transition-colors"
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
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Habilidades Técnicas
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Liste suas habilidades separadas por vírgula</label>
                <input
                  type="text"
                  value={habilidadesInput}
                  onChange={handleHabilidadesChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
                  placeholder="Ex: JavaScript, React, Node.js, HTML/CSS, Git, AWS, Docker"
                />
                <p className="text-xs text-gray-500 mt-3">Dica: Inclua tecnologias, ferramentas e metodologias relevantes para a vaga.</p>
                
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
                  Idiomas
                </h2>
                <button
                  type="button"
                  onClick={() => addField("idiomas", { idioma: "", nivel: "" })}
                  className="flex items-center text-black hover:text-white hover:bg-black text-sm font-medium border border-black px-4 py-2 rounded-md transition-colors"
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
                <h2 className="text-2xl font-semibold text-gray-800">
                  Certificações
                </h2>
                <button
                  type="button"
                  onClick={() => addField("certificacoes", "")}
                  className="flex items-center text-black hover:text-white hover:bg-black text-sm font-medium border border-black px-4 py-2 rounded-md transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Adicionar Certificação
                </button>
              </div>
              
              {formData.certificacoes.length > 0 ? (
                formData.certificacoes.map((cert, idx) => (
                  <div key={idx} className="mb-6 p-6 border border-gray-200 rounded-lg relative bg-white shadow-sm">
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
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black"
                        placeholder="Ex: Certificação AWS Cloud Practitioner"
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
                <p className="text-sm text-gray-500 italic">Nenhuma certificação adicionada (opcional)</p>
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