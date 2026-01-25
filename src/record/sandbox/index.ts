// does not yet record or return steps

/**
 * Execute JavaScript code in a container element
 * @param {string} code - The JavaScript code to execute
 * @param {Object} config - Execution configuration options
 * @param {HTMLElement} container - DOM element to render results into
 * @returns {Promise<void>} Resolves when execution completes
 */
export async function executeJavaScript(code, config = {}, container = null) {
  if (!container) {
    console.warn('No container provided for JavaScript execution');
    return;
  }

  if (!code?.trim()) {
    console.warn('No code to execute');
    return;
  }

  // Clean up container
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  // Default configuration
  const finalConfig = {
    debug: false,
    type: 'script', // 'script' or 'module'
    testing: false,
    loopGuard: {
      active: false,
      max: 100
    },
    ...config
  };

  try {
    // Prepare code with optional modifications
    let finalCode = code;

    if (finalConfig.loopGuard?.active) {
      finalCode = addLoopGuard(finalCode, finalConfig.loopGuard.max);
    }

    if (finalConfig.debug) {
      finalCode = `/* ----------------------------- */   debugger;\n\n\n\n${finalCode}\n\n\n/* ----------------------------- */   debugger;`;
    }

    // Create iframe for execution
    const iframe = document.createElement('iframe');
    iframe.style.cssText = `
			width: 100%;
			height: 0px;
			border: none;
			display: none;
		`;

    // Set up iframe load handler
    iframe.onload = () => {
      try {
        const iframeWindow = iframe.contentWindow;
        const iframeDocument = iframe.contentDocument;

        if (!iframeWindow || !iframeDocument) {
          throw new Error('Failed to access iframe window or document');
        }

        // Add globals to iframe (like old-runner.js)
        Object.assign(iframeWindow, finalConfig.globals || {});

        // Create and execute script (use innerHTML like old-runner.js)
        const script = document.createElement('script');
        script.innerHTML = finalCode;

        if (finalConfig.type === 'module') {
          script.type = 'module';
        }

        // Execute the script
        iframeDocument.body.appendChild(script);
      } catch (error) {
        // console.error('❌ JavaScript execution error:', error);
      }
    };

    container.appendChild(iframe);

    // Iframe loads automatically when appended - no need to set src
  } catch (error) {
    console.error('❌ JavaScript execution setup error:', error);
    throw error;
  }
}
