import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ArticleComparison from './components/ArticleComparison';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/article/:id" element={<ArticleComparison />} />
    </Routes>
  );
}

export default App;
