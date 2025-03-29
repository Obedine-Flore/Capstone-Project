import React, { useState } from 'react';

const SimpleHtmlEditor = ({ value, onChange }) => {
  const [showHtml, setShowHtml] = useState(false);
  
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };
  
  const toggleView = () => {
    setShowHtml(!showHtml);
  };
  
  // Basic formatting functions
  const applyFormat = (format) => {
    let formattedText = '';
    
    switch(format) {
      case 'h2':
        formattedText = `<h2>${getSelectedText()}</h2>`;
        break;
      case 'h3':
        formattedText = `<h3>${getSelectedText()}</h3>`;
        break;
      case 'bold':
        formattedText = `<strong>${getSelectedText()}</strong>`;
        break;
      case 'italic':
        formattedText = `<em>${getSelectedText()}</em>`;
        break;
      case 'ul':
        formattedText = `<ul>\n  <li>${getSelectedText()}</li>\n</ul>`;
        break;
      case 'ol':
        formattedText = `<ol>\n  <li>${getSelectedText()}</li>\n</ol>`;
        break;
      case 'blockquote':
        formattedText = `<blockquote>${getSelectedText()}</blockquote>`;
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (url) {
          formattedText = `<a href="${url}" target="_blank">${getSelectedText()}</a>`;
        }
        break;
      default:
        return;
    }
    
    insertText(formattedText);
  };
  
  const getSelectedText = () => {
    const textarea = document.getElementById('html-editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    return value.substring(start, end) || 'Text here';
  };
  
  const insertText = (text) => {
    const textarea = document.getElementById('html-editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const newText = value.substring(0, start) + text + value.substring(end);
    if (onChange) {
      onChange(newText);
    }
    
    // Reset selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };
  
  return (
    <div>
      <div className="border rounded-md overflow-hidden">
        <div className="bg-gray-100 p-2 border-b flex flex-wrap gap-1">
          <button 
            type="button"
            onClick={() => applyFormat('h2')} 
            className="px-2 py-1 bg-white border rounded hover:bg-gray-50"
            title="Heading 2"
          >
            H2
          </button>
          <button 
            type="button"
            onClick={() => applyFormat('h3')} 
            className="px-2 py-1 bg-white border rounded hover:bg-gray-50"
            title="Heading 3"
          >
            H3
          </button>
          <button 
            type="button"
            onClick={() => applyFormat('bold')} 
            className="px-2 py-1 bg-white border rounded hover:bg-gray-50 font-bold"
            title="Bold"
          >
            B
          </button>
          <button 
            type="button"
            onClick={() => applyFormat('italic')} 
            className="px-2 py-1 bg-white border rounded hover:bg-gray-50 italic"
            title="Italic"
          >
            I
          </button>
          <button 
            type="button"
            onClick={() => applyFormat('ul')} 
            className="px-2 py-1 bg-white border rounded hover:bg-gray-50"
            title="Bullet List"
          >
            • List
          </button>
          <button 
            type="button"
            onClick={() => applyFormat('ol')} 
            className="px-2 py-1 bg-white border rounded hover:bg-gray-50"
            title="Numbered List"
          >
            1. List
          </button>
          <button 
            type="button"
            onClick={() => applyFormat('blockquote')} 
            className="px-2 py-1 bg-white border rounded hover:bg-gray-50"
            title="Quote"
          >
            "Quote"
          </button>
          <button 
            type="button"
            onClick={() => applyFormat('link')} 
            className="px-2 py-1 bg-white border rounded hover:bg-gray-50"
            title="Link"
          >
            Link
          </button>
          <div className="flex-grow"></div>
          <button 
            type="button"
            onClick={toggleView} 
            className="px-2 py-1 bg-white border rounded hover:bg-gray-50 text-xs"
          >
            {showHtml ? "Preview" : "HTML"}
          </button>
        </div>
        
        {showHtml ? (
          <textarea 
            id="html-editor"
            value={value} 
            onChange={handleChange}
            className="w-full px-3 py-2 min-h-[250px]"
          />
        ) : (
          <div className="p-3 min-h-[250px] prose max-w-none bg-white" dangerouslySetInnerHTML={{ __html: value }} />
        )}
      </div>
    </div>
  );
};

export default SimpleHtmlEditor;