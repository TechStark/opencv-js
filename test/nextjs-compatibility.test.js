// Comprehensive test for Next.js 14.1.0 compatibility
const path = require('path');

describe('Next.js 14.1.0 Compatibility', () => {
  
  test('should handle module.exports being null', () => {
    // Save original module.exports
    const originalExports = module.exports;
    
    try {
      // Set module.exports to null (simulating Next.js 14.1.0 issue)
      module.exports = null;
      
      // Clear require cache to force re-evaluation
      const opencvPath = path.resolve(__dirname, '../dist/opencv.js');
      delete require.cache[opencvPath];
      
      // This should not throw an error
      expect(() => {
        require(opencvPath);
      }).not.toThrow();
      
    } finally {
      // Restore original module.exports
      module.exports = originalExports;
    }
  });
  
  test('should handle undefined this context', () => {
    const opencvPath = path.resolve(__dirname, '../dist/opencv.js');
    
    // Clear require cache
    delete require.cache[opencvPath];
    
    // Load in strict mode context (where 'this' would be undefined)
    expect(() => {
      (function() {
        'use strict';
        require(opencvPath);
      })();
    }).not.toThrow();
  });
  
  test('should successfully load opencv.js', () => {
    const opencvPath = path.resolve(__dirname, '../dist/opencv.js');
    
    // Clear require cache
    delete require.cache[opencvPath];
    
    const cv = require(opencvPath);
    
    expect(cv).toBeDefined();
    expect(typeof cv).toBe('object');
  });
  
  test('should work in various module environments', () => {
    const opencvPath = path.resolve(__dirname, '../dist/opencv.js');
    
    // Test different module.exports scenarios
    const scenarios = [
      { name: 'normal exports', exports: {} },
      { name: 'null exports', exports: null },
      { name: 'undefined exports', exports: undefined },
      { name: 'false exports', exports: false }
    ];
    
    scenarios.forEach(scenario => {
      const originalExports = module.exports;
      
      try {
        module.exports = scenario.exports;
        delete require.cache[opencvPath];
        
        expect(() => {
          require(opencvPath);
        }).not.toThrow();
        
      } finally {
        module.exports = originalExports;
      }
    });
  });
});