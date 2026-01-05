import React from 'react';
import { Platform } from 'react-native';

const GlobalStyles = () => {
  if (Platform.OS !== 'web') return null;

  return (
    <style type="text/css">{`
      /* Lock Body to prevent window scrolling, ensuring App-like feel */
      html, body, #root {
        height: 100%;
        overflow: hidden;
      }

      /* Native Scrollbar Styling */
      
      /* WebKit (Chrome, Safari, Edge) */
      ::-webkit-scrollbar {
        width: 14px;
        height: 14px;
      }
      
      ::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-left: 1px solid #ddd;
      }
       
      ::-webkit-scrollbar-thumb {
        background-color: #555; /* Dark Grey */
        border: 3px solid #f1f1f1; /* Creates padding around thumb */
        border-radius: 8px;
        min-height: 40px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background-color: #333;
      }
      
      /* Firefox */
      * {
        scrollbar-width: auto;
        scrollbar-color: #555 #f1f1f1;
      }
    `}</style>
  );
};

export default GlobalStyles;
