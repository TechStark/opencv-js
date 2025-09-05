import type { Mat } from "./types/opencv/Mat";
import type { int } from "./types/opencv/_types";

declare global {
  interface Mat {
    reshape(cn: int, rows?: int): Mat;
  }
}

// Extend Mat prototype with reshape method
export function extendMatWithReshape() {
  if (typeof global !== 'undefined' && global.cv && global.cv.Mat) {
    const MatPrototype = global.cv.Mat.prototype;
    
    if (!MatPrototype.reshape) {
      MatPrototype.reshape = function(cn: int, rows?: int): Mat {
        // Get current matrix properties
        const currentRows = this.rows;
        const currentCols = this.cols;
        const currentChannels = this.channels();
        const currentType = this.type();
        const currentDepth = currentType & 7; // Extract depth (CV_8U, CV_16S, etc.)
        
        const totalDataElements = currentRows * currentCols * currentChannels;
        
        let newChannels: int;
        let newRows: int; 
        let newCols: int;
        
        // OpenCV reshape semantics:
        // - cn = -1 means "auto-calculate channels"
        // - rows = -1 or undefined means "auto-calculate rows"
        // - The total number of elements must remain constant
        
        if (cn === -1) {
          // Auto-calculate channels based on rows
          if (rows === undefined || rows === 0) {
            throw new Error("When cn=-1, rows parameter must be specified");
          }
          
          newRows = rows;
          // Calculate how many elements per row we need
          const elementsPerRow = totalDataElements / newRows;
          if (Math.floor(elementsPerRow) !== elementsPerRow) {
            throw new Error(`Cannot reshape: total elements (${totalDataElements}) not evenly divisible by rows (${newRows})`);
          }
          
          // Try to fit this into a reasonable matrix structure
          // First, try to keep channels as 1 (most common case for vectorization)
          newChannels = 1;
          newCols = elementsPerRow;
          
          // If that creates too many columns, try other channel arrangements
          if (newCols > 10000) { // Arbitrary large number check
            // Try to use original channels if it makes sense
            if (elementsPerRow % currentChannels === 0) {
              newChannels = currentChannels;
              newCols = elementsPerRow / currentChannels;
            } else {
              // Try common channel counts
              for (const testChannels of [3, 4, 2]) {
                if (elementsPerRow % testChannels === 0) {
                  newChannels = testChannels;
                  newCols = elementsPerRow / testChannels;
                  break;
                }
              }
            }
          }
        } else {
          // Channels specified
          newChannels = cn;
          
          if (rows === undefined || rows === 0) {
            // Auto-calculate rows - keep matrix as close to original as possible
            const matrixElements = totalDataElements / newChannels;
            if (Math.floor(matrixElements) !== matrixElements) {
              throw new Error(`Cannot reshape: total elements (${totalDataElements}) not evenly divisible by channels (${newChannels})`);
            }
            
            // Try to keep close to original shape
            newRows = currentRows;
            newCols = matrixElements / newRows;
            
            if (Math.floor(newCols) !== newCols) {
              // Original shape doesn't work, find best factorization
              newRows = Math.floor(Math.sqrt(matrixElements));
              newCols = Math.floor(matrixElements / newRows);
              
              if (newRows * newCols !== matrixElements) {
                for (let r = 1; r <= matrixElements; r++) {
                  if (matrixElements % r === 0) {
                    newRows = r;
                    newCols = matrixElements / r;
                    break;
                  }
                }
              }
            }
          } else {
            // Both channels and rows specified
            newRows = rows;
            const matrixElements = totalDataElements / newChannels;
            if (Math.floor(matrixElements) !== matrixElements) {
              throw new Error(`Cannot reshape: total elements (${totalDataElements}) not evenly divisible by channels (${newChannels})`);
            }
            
            newCols = matrixElements / newRows;
            if (Math.floor(newCols) !== newCols) {
              throw new Error(`Cannot reshape: matrix elements (${matrixElements}) not evenly divisible by rows (${newRows})`);
            }
          }
        }
        
        // Final validation
        if (newRows * newCols * newChannels !== totalDataElements) {
          throw new Error(`Reshape validation failed: ${newRows} × ${newCols} × ${newChannels} = ${newRows * newCols * newChannels} ≠ ${totalDataElements}`);
        }
        
        // Create the new matrix type
        let newType: int;
        switch (newChannels) {
          case 1:
            newType = currentDepth;
            break;
          case 2:
            newType = currentDepth + 8;
            break;
          case 3:
            newType = currentDepth + 16;
            break;
          case 4:
            newType = currentDepth + 24;
            break;
          default:
            newType = currentDepth + ((newChannels - 1) << 3);
            break;
        }
        
        try {
          // Create new matrix with calculated dimensions
          const result = new global.cv.Mat(newRows, newCols, newType);
          
          // Copy all the data (should be same amount, just organized differently)
          const srcData = this.data;
          const dstData = result.data;
          const copyLength = Math.min(srcData.length, dstData.length);
          
          for (let i = 0; i < copyLength; i++) {
            dstData[i] = srcData[i];
          }
          
          return result;
        } catch (error) {
          throw new Error(`Failed to create reshaped matrix: ${error instanceof Error ? error.message : String(error)}`);
        }
      };
    }
  }
}