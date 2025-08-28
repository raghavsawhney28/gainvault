import React from 'react';
import threedImage from '../../assets/threed.png';

export default function NewSection() {
  console.log('NewSection rendering standalone version');
  
  return (
    <section style={{
      width: '100%',
      backgroundColor: 'transparent',
      padding: '0 0',
      marginTop: '-15rem',
      minHeight: '300px',
      position: 'relative',
      zIndex: 9999
    }}>
      <div style={{
        maxWidth: '100%',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0'
        }}>
          {/* Left Column - Image fully left */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginLeft: '-2rem'
          }}>
            <div style={{
              width: '1000px',
              height: '1000px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src={threedImage}
                alt="3D trading visualization"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  
                }}
              />
            </div>
          </div>

          {/* Right Column - Text fully right */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end'
          }}>
            <div style={{
              textAlign: 'right'
            }}>
              <h2 style={{
                fontSize: '4rem',
                fontWeight: 800,
                color: '#ffffff',
                margin: '0 0 1rem 0',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                lineHeight: 1.1,
                textShadow: '0 4px 8px rgba(0, 0, 0, 0.5)'
              }}>
                MONEY TALKS
              </h2>
              <h2 style={{
                fontSize: '4rem',
                fontWeight: 800,
                color: '#ffffff',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                lineHeight: 1.1,
                textShadow: '0 4px 8px rgba(0, 0, 0, 0.5)'
              }}>
                WE TRANSLATE
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
