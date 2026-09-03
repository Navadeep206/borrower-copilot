import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar.jsx';
import PersonaSelector from './components/PersonaSelector.jsx';
import DynamicQuestionnaire from './components/DynamicQuestionnaire.jsx';
import OutputDashboard from './components/OutputDashboard.jsx';
import RuleSandbox from './components/RuleSandbox.jsx';
import RulesInspector from './components/RulesInspector.jsx';
import { PERSONAS } from './engine/personas.js';
import { DEFAULT_RULES } from './engine/rules.js';
import { evaluateBorrower } from './engine/calculator.js';
import './styles/app.css';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [rules, setRules] = useState(DEFAULT_RULES);
  const [activePersonaId, setActivePersonaId] = useState('priya');
  const [answers, setAnswers] = useState(PERSONAS[0].answers);

  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Real-time evaluation calculation whenever answers or rules change
  const evaluation = useMemo(() => {
    return evaluateBorrower(answers, rules);
  }, [answers, rules]);

  const handleSelectPersona = (persona) => {
    setActivePersonaId(persona.id);
    setAnswers(persona.answers);
  };

  const handleResetCustom = () => {
    setActivePersonaId('custom');
    setAnswers({
      loanPurpose: 'personal',
      requestedAmount: 500000,
      desiredTenureMonths: 36,
      employmentType: 'salaried',
      netMonthlyIncome: 60000,
      existingEMIs: 0,
      livingExpenses: 25000,
      age: 30,
      creditScore: 750
    });
  };

  return (
    <div className="app-container">
      <Navbar
        theme={theme}
        setTheme={setTheme}
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenSandbox={() => setIsSandboxOpen(true)}
      />

      {/* Persona Quick Selector */}
      <PersonaSelector
        activePersonaId={activePersonaId}
        onSelectPersona={handleSelectPersona}
        onResetCustom={handleResetCustom}
      />

      {/* Main Split View: Left Questionnaire, Right Output Dashboard */}
      <div className="dashboard-grid">
        <div>
          <DynamicQuestionnaire answers={answers} setAnswers={setAnswers} />
        </div>

        <div>
          <OutputDashboard evaluation={evaluation} />
        </div>
      </div>

      {/* Modals */}
      <RuleSandbox
        isOpen={isSandboxOpen}
        onClose={() => setIsSandboxOpen(false)}
        rules={rules}
        setRules={setRules}
      />

      <RulesInspector
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />
    </div>
  );
}
