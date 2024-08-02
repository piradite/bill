import React, { useState, useEffect, useRef } from 'react';
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import './App.css'; // Ensure you have the appropriate CSS styles
import MysteryForm from './MysteryForm';

const App = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (content) {
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
  
      // Create and append new DOM element for Fancybox content
      const existingElement = document.getElementById(content.id);
      if (existingElement) {
        existingElement.remove();
      }
  
      const newElement = document.createElement('div');
      newElement.id = content.id;
      newElement.className = 'hidden html';
      newElement.innerHTML = content.html;
      document.body.appendChild(newElement);
  
      Fancybox.show([
        {
          src: `#${content.id}`,
          type: 'inline',
        },
      ], {
        backdropClick: false,
        Toolbar: {
          display: {
            left: [],
            middle: [],
            right: ['close'],
          },
        },
        on: {
          close: () => {
            const element = document.getElementById(content.id);
            if (element) {
              // Clean up iframes and other embedded content
              const iframes = element.querySelectorAll('iframe');
              iframes.forEach((iframe) => {
                iframe.src = 'about:blank'; // Stop video playback
                iframe.remove();
              });
  
              // Clean up videos and audios
              const mediaElements = element.querySelectorAll('video, audio');
              mediaElements.forEach((media) => {
                media.pause();
                media.currentTime = 0;
                media.remove(); // Optionally remove the media elements
              });
  
              // Clean up images and other embedded content
              const images = element.querySelectorAll('img');
              images.forEach((img) => {
                img.src = ''; // Optionally clear image sources
              });
  
              const embeds = element.querySelectorAll('embed');
              embeds.forEach((embed) => {
                embed.remove();
              });
  
              const objects = element.querySelectorAll('object');
              objects.forEach((object) => {
                object.remove();
              });
  
              const scripts = element.querySelectorAll('script');
              scripts.forEach((script) => {
                script.remove();
              });
  
              // Remove the content element itself
              element.remove();
              setContent(null);
  
              if (abortControllerRef.current) {
                abortControllerRef.current.abort();
              }
            }
          },
        },
      });
    }
  }, [content]);
  
  

  const handleChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (code.trim().length < 2) {
      setError('Code is too short');
      setIsLoading(false);
      return;
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const response = await fetch('http://localhost:3001/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
        body: JSON.stringify({ code: code.trim() }),
        signal: abortController.signal,
      });

      if (response.status === 404) {
        setError('Invalid code');
        setContent(null);
      } else if (!response.ok) {
        setError('Error fetching content');
        setContent(null);
      } else {
        const newContent = await response.text();
        const existingElement = document.getElementById(code.trim());
        if (existingElement) {
          existingElement.remove();
        }
        setContent({
          id: code.trim(),
          html: newContent,
        });
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request aborted');
      } else {
        setError('Error submitting code');
        setContent(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="default bg-black">
      <main>
        <div className="relative flex items-center justify-center w-screen min-h-dvh overflow-hidden">
          <MysteryForm
            code={code}
            onChange={handleChange}
            onSubmit={handleSubmit}
            error={error}
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
