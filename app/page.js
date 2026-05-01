import './landing.css'
import Link from 'next/link'

export default function Landing() {
  return (
    <>
      <header>
        <a href="#" className="logo">
          <img src="/obraqr.png" alt="ObraQR logo" />
        </a>
        <nav>
          <a href="#como">Cómo funciona</a>
          <a href="#precios">Precios</a>
          <a href="#testimonios">Testimonios</a>
          <a href="#contacto">Contacto</a>
        </nav>
        <div className="header-btns">
          <Link href="/login" className="btn-ghost">Entrar</Link>
          <Link href="/registro" className="btn-solid">Empezar gratis</Link>
        </div>
      </header>

      <section className="hero">
        <div className="hero-left">
          <span className="hero-tag">Diario de obra digital</span>
          <h1>Tu cliente siempre<br />sabe cómo va<br /><em>su obra.</em></h1>
        </div>
        <div className="hero-right">
          <div className="hero-bottom">
            <p className="hero-sub">
              Sin llamadas. Sin WhatsApp. Sin excusas.<br />
              Sube una foto en 10 segundos y tu cliente lo ve al instante.
            </p>
            <Link href="/registro" className="btn-negro">Crear mi primera obra — es gratis</Link>
          </div>
        </div>
      </section>

      <div className="trust-bar">
        <div className="trust-col-left">Ya confían en ObraQR</div>
        <div className="trust-track-wrap">
          <div className="trust-track">
            <span>Reformas García</span><span>Construcciones Molina</span><span>Obras del Mediterráneo</span>
            <span>Talleres Benlliure</span><span>Constructora Norte</span><span>Reformas Sánchez e Hijos</span>
            <span>Edificaciones Costa</span><span>Obras Barceló</span><span>Reformas García</span>
            <span>Construcciones Molina</span><span>Obras del Mediterráneo</span><span>Talleres Benlliure</span>
            <span>Constructora Norte</span><span>Reformas Sánchez e Hijos</span><span>Edificaciones Costa</span>
            <span>Obras Barceló</span>
          </div>
        </div>
      </div>

      <div className="como-intro" id="como">
        <h2>Tres pasos. Menos de un minuto.</h2>
        <p>Tan fácil que lo usas desde la obra, con los guantes puestos.</p>
      </div>

      <div className="steps-wrap">
        <div className="step step-1">
          <div className="step-left">
            <div className="step-num">1</div>
            <div className="step-tag-label">Paso uno</div>
            <h3>Crea tu obra<br />en 30 segundos.</h3>
            <p>Nombre, dirección y listo. ObraQR genera automáticamente una página web y un código QR único para esa obra.</p>
          </div>
          <div className="step-right">
            <div className="mockup">
              <div className="mockup-screen">
                <div className="m-bar"></div>
                <div className="m-bar2"></div>
                <div className="m-input">Nombre de la obra...</div>
                <div className="m-input2"></div>
                <div className="m-btn">CREAR OBRA</div>
              </div>
            </div>
          </div>
        </div>

        <div className="step step-2">
          <div className="step-left">
            <div className="step-num">2</div>
            <div className="step-tag-label">Paso dos</div>
            <h3>Sube una foto<br />desde el móvil.</h3>
            <p>Un toque, una foto, dos palabras de texto. En menos de 10 segundos la actualización está publicada.</p>
          </div>
          <div className="step-right">
            <div className="mockup">
              <div className="mockup-screen">
                <div className="m-cam">📷</div>
                <div className="m-cap"></div>
                <div className="m-btn-y">PUBLICAR AHORA</div>
              </div>
            </div>
          </div>
        </div>

        <div className="step step-3">
          <div className="step-left">
            <div className="step-num">3</div>
            <div className="step-tag-label">Paso tres</div>
            <h3>Tu cliente lo ve<br />al instante.</h3>
            <p>El cliente escanea el QR una vez y ya tiene su enlace. Sin app, sin registro, sin llamadas.</p>
          </div>
          <div className="step-right">
            <div className="mockup">
              <div className="mockup-screen" style={{background:'#0f3d52', padding:'32px 12px 12px'}}>
                <div className="m-hdr"></div>
                <div className="m-row">
                  <div className="m-dot"></div>
                  <div className="m-lines">
                    <div className="m-line" style={{width:'78%'}}></div>
                    <div className="m-line" style={{width:'52%'}}></div>
                  </div>
                </div>
                <div className="m-img"></div>
                <div className="m-row" style={{marginTop:'8px'}}>
                  <div className="m-dot"></div>
                  <div className="m-lines">
                    <div className="m-line" style={{width:'65%'}}></div>
                    <div className="m-line" style={{width:'38%'}}></div>
                  </div>
                </div>
                <div className="m-img" style={{height:'38px'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="step-spacer"></div>

      <section id="precios">
        <div className="section-title">
          <h2>Un plan para cada momento</h2>
          <p>Empieza gratis. Sube cuando lo necesites. Sin permanencias.</p>
        </div>
        <div className="planes-grid">
          <div className="plan-card">
            <div className="plan-tier">Plan</div>
            <div className="plan-name">Gratis</div>
            <div className="plan-tagline">Para probar y enamorarte.</div>
            <div className="plan-price"><span className="free-lbl">0 €</span></div>
            <div className="plan-divider"></div>
            <ul className="plan-features">
              <li><span className="ico-ok">✓</span> 1 obra activa</li>
              <li><span className="ico-ok">✓</span> 1 foto por actualización</li>
              <li><span className="ico-ok">✓</span> Página pública con QR</li>
              <li><span className="ico-ok">✓</span> Últimas 10 actualizaciones</li>
              <li><span className="ico-no">✗</span> Marca de agua visible</li>
              <li><span className="ico-no">✗</span> Sin personalización</li>
              <li><span className="ico-no">✗</span> Sin PDF ni notificaciones</li>
            </ul>
            <Link href="/registro" className="plan-cta cta-outline">Empezar gratis</Link>
          </div>
          <div className="plan-card">
            <div className="plan-tier">Plan</div>
            <div className="plan-name">Starter</div>
            <div className="plan-tagline">Queda bien con tu cliente.</div>
            <div className="plan-price"><span className="amount">6,95€</span><span className="period">/mes</span></div>
            <div className="plan-divider"></div>
            <ul className="plan-features">
              <li><span className="ico-ok">✓</span> 3 obras activas</li>
              <li><span className="ico-ok">✓</span> 3 fotos por actualización</li>
              <li><span className="ico-ok">✓</span> Sin marca de agua</li>
              <li><span className="ico-ok">✓</span> Portada personalizable</li>
              <li><span className="ico-ok">✓</span> Fases en timeline</li>
              <li><span className="ico-ok">✓</span> Botón WhatsApp en página</li>
              <li><span className="ico-no">✗</span> Sin PDF ni notificaciones</li>
            </ul>
            <Link href="/registro" className="plan-cta cta-outline">Elegir Starter</Link>
          </div>
          <div className="plan-card featured">
            <div className="plan-badge">Más popular</div>
            <div className="plan-tier">Plan</div>
            <div className="plan-name">Pro</div>
            <div className="plan-tagline">Protégete y ahorra tiempo.</div>
            <div className="plan-price"><span className="amount">14,95€</span><span className="period">/mes</span></div>
            <div className="plan-divider"></div>
            <ul className="plan-features">
              <li><span className="ico-ok">✓</span> 8 obras activas</li>
              <li><span className="ico-ok">✓</span> 10 fotos por actualización</li>
              <li><span className="ico-ok">✓</span> Todo lo del Starter</li>
              <li><span className="ico-ok">✓</span> PDF automático mensual</li>
              <li><span className="ico-ok">✓</span> Notificaciones al cliente</li>
              <li><span className="ico-ok">✓</span> Registro de extras firmado</li>
              <li><span className="ico-ok">✓</span> Logo del constructor</li>
            </ul>
            <Link href="/registro" className="plan-cta cta-blue">Elegir Pro</Link>
          </div>
          <div className="plan-card">
            <div className="plan-tier">Plan</div>
            <div className="plan-name">Business</div>
            <div className="plan-tagline">Gestiona tu empresa.</div>
            <div className="plan-price"><span className="amount">29€</span><span className="period">/mes</span></div>
            <div className="plan-divider"></div>
            <ul className="plan-features">
              <li><span className="ico-ok">✓</span> Obras ilimitadas</li>
              <li><span className="ico-ok">✓</span> Multiusuario con roles</li>
              <li><span className="ico-ok">✓</span> Todo lo del Pro</li>
              <li><span className="ico-ok">✓</span> Panel global de obras</li>
              <li><span className="ico-ok">✓</span> Analítica de cliente</li>
              <li><span className="ico-ok">✓</span> Portfolio público + leads</li>
              <li><span className="ico-ok">✓</span> Informe de entrega PDF</li>
            </ul>
            <Link href="/registro" className="plan-cta cta-black">Elegir Business</Link>
          </div>
        </div>
      </section>

      <section id="testimonios">
        <div className="section-title">
          <h2>Lo que dicen los constructores</h2>
          <p>Gente real, obras reales, menos llamadas.</p>
        </div>
        <div className="testi-grid">
          <div className="testi-card">
            <div className="testi-stars">★★★★★</div>
            <p className="testi-text">"Antes mis clientes me llamaban tres veces por semana preguntando cómo iba la obra. Ahora no me llama nadie. Y están más contentos que nunca."</p>
            <div className="testi-author">
              <div className="testi-avatar">MG</div>
              <div>
                <div className="testi-name">Manuel García</div>
                <div className="testi-role">Reformas García · Valencia</div>
              </div>
            </div>
          </div>
          <div className="testi-card">
            <div className="testi-stars">★★★★★</div>
            <p className="testi-text">"El PDF automático al acabar la obra es una pasada. Se lo mando al cliente como documento oficial y quedo de lujo. Parece una empresa grande."</p>
            <div className="testi-author">
              <div className="testi-avatar" style={{background:'#0f3d52'}}>SR</div>
              <div>
                <div className="testi-name">Sara Romero</div>
                <div className="testi-role">Construcciones Romero · Madrid</div>
              </div>
            </div>
          </div>
          <div className="testi-card">
            <div className="testi-stars">★★★★★</div>
            <p className="testi-text">"Tengo 6 obras abiertas y mis operarios suben las fotos ellos solos. Yo solo reviso el panel. Primera herramienta que uso de verdad cada día."</p>
            <div className="testi-author">
              <div className="testi-avatar" style={{background:'#388e3c'}}>JM</div>
              <div>
                <div className="testi-name">Jordi Molina</div>
                <div className="testi-role">Edificaciones Molina · Barcelona</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="video-block">
        <div className="video-noise"></div>
        <div className="video-inner">
          <div className="video-play">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
          <h3>Ver cómo funciona en 90 segundos</h3>
          <p>Un constructor real mostrando su flujo de trabajo con ObraQR</p>
        </div>
      </div>

      <section className="cta-final">
        <h2>Empieza hoy.<br /><em>Es gratis.</em></h2>
        <p>Sin tarjeta de crédito. Sin instalación. Tu primera obra en menos de 2 minutos.</p>
        <Link href="/registro" className="btn-negro">Crear mi primera obra</Link>
      </section>

      <footer id="contacto">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-brand-name">ObraQR</span>
            <p>El diario de obra digital que sustituye las llamadas y el WhatsApp por algo profesional, visual y estructurado.</p>
          </div>
          <div className="footer-col">
            <h4>Producto</h4>
            <ul>
              <li><a href="#como">Cómo funciona</a></li>
              <li><a href="#precios">Precios</a></li>
              <li><a href="#testimonios">Testimonios</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Aviso legal</a></li>
              <li><a href="#">Privacidad</a></li>
              <li><a href="#">Cookies</a></li>
              <li><a href="#">Contacto</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 ObraQR — Todos los derechos reservados</span>
          <div className="footer-socials">
            <a href="#">Instagram</a>
            <a href="#">LinkedIn</a>
            <a href="#">info@obraqr.com</a>
          </div>
        </div>
      </footer>
    </>
  )
}