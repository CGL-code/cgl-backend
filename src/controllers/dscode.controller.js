export function getDsCodeOptions(req, res) {
  return res.json({
    version: "1.0",
    options: {
      semanticPurposes: [
        { id: "SP01", label: "Definition & Meaning" },
        { id: "SP02", label: "Rule & Principle" }
      ],
      semantics: [
        { id: "SM01", label: "General Definition", purposeId: "SP01" },
        { id: "SM02", label: "Technical Definition", purposeId: "SP01" },
        { id: "SM03", label: "Operational Rule", purposeId: "SP02" }
      ],
      dscodes: [
        { id: "DS001", label: "Formal Definition", semanticId: "SM01" },
        { id: "DS002", label: "Simplified Meaning", semanticId: "SM01" },
        { id: "DS010", label: "System Rule", semanticId: "SM03" }
      ]
    }
  });
}
