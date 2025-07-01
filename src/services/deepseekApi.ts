import axios from 'axios';
import { Message, DeepSeekResponse } from '../types';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// System prompt for generating clean, production-ready code
const SYSTEM_PROMPT = `You are an expert web developer who creates beautiful, modern, and production-ready websites. When given a request, you should:

1. Generate a complete HTML file with embedded CSS and JavaScript
2. Use modern CSS features like flexbox, grid, and animations
3. Make the design responsive and mobile-friendly
4. Include proper semantic HTML structure
5. Use professional color schemes and typography
6. Add subtle animations and hover effects
7. Ensure the code is clean, well-commented, and production-ready
8. Include SEO-friendly meta tags and structure
9. Make it visually appealing with proper spacing and layouts

Always return ONLY the complete HTML code without any explanations or markdown formatting. The HTML should be a single file that can be saved and opened directly in a browser.`;

export const generateCode = async (conversation: Message[]): Promise<string> => {
  try {
    // Get API key from environment or use a placeholder
    const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY || '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';
    
    if (apiKey === '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') {
      // For demo purposes, return a sample HTML when no API key is provided
      return generateSampleHTML(conversation[conversation.length - 1]?.content || 'landing page');
    }

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversation.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    const response = await axios.post<DeepSeekResponse>(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek-chat',
        messages,
        temperature: 0.7,
        max_tokens: 8000,
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const generatedContent = response.data.choices[0]?.message?.content;
    if (!generatedContent) {
      throw new Error('No content generated from API');
    }

    return generatedContent;
  } catch (error) {
    console.error('DeepSeek API Error:', error);
    
    // Fallback to sample HTML for demo
    if (axios.isAxiosError(error)) {
      console.warn('API call failed, using sample HTML for demo');
      return generateSampleHTML(conversation[conversation.length - 1]?.content || 'landing page');
    }
    
    throw new Error('Failed to generate code. Please check your API key and try again.');
  }
};

// Sample HTML generator for demo purposes
const generateSampleHTML = (prompt: string): string => {
  const isLandingPage = prompt.toLowerCase().includes('landing') || prompt.toLowerCase().includes('homepage');
  const isPortfolio = prompt.toLowerCase().includes('portfolio');
  const isDashboard = prompt.toLowerCase().includes('dashboard');
  
  if (isPortfolio) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio - John Doe</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem 0; text-align: center; }
        .hero h1 { font-size: 3rem; margin-bottom: 1rem; animation: fadeInUp 1s ease; }
        .hero p { font-size: 1.2rem; opacity: 0.9; animation: fadeInUp 1s ease 0.3s both; }
        .projects { padding: 4rem 0; background: #f8f9fa; }
        .projects h2 { text-align: center; margin-bottom: 3rem; font-size: 2.5rem; color: #333; }
        .project-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        .project-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); transition: transform 0.3s ease; }
        .project-card:hover { transform: translateY(-5px); }
        .project-card img { width: 100%; height: 200px; object-fit: cover; }
        .project-card-content { padding: 1.5rem; }
        .project-card h3 { margin-bottom: 0.5rem; color: #333; }
        .project-card p { color: #666; margin-bottom: 1rem; }
        .btn { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 0.8rem 2rem; text-decoration: none; border-radius: 25px; transition: all 0.3s ease; }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4); }
        footer { background: #333; color: white; text-align: center; padding: 2rem 0; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 768px) { .hero h1 { font-size: 2rem; } .project-grid { grid-template-columns: 1fr; } }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <div class="hero">
                <h1>John Doe</h1>
                <p>Full Stack Developer & Designer</p>
            </div>
        </div>
    </header>
    
    <section class="projects">
        <div class="container">
            <h2>Featured Projects</h2>
            <div class="project-grid">
                <div class="project-card">
                    <img src="https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Project 1">
                    <div class="project-card-content">
                        <h3>E-Commerce Platform</h3>
                        <p>A modern e-commerce solution built with React and Node.js</p>
                        <a href="#" class="btn">View Project</a>
                    </div>
                </div>
                <div class="project-card">
                    <img src="https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Project 2">
                    <div class="project-card-content">
                        <h3>Task Management App</h3>
                        <p>A collaborative task management tool with real-time updates</p>
                        <a href="#" class="btn">View Project</a>
                    </div>
                </div>
                <div class="project-card">
                    <img src="https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Project 3">
                    <div class="project-card-content">
                        <h3>Weather Dashboard</h3>
                        <p>A beautiful weather app with interactive charts and forecasts</p>
                        <a href="#" class="btn">View Project</a>
                    </div>
                </div>
            </div>
        </div>
    </section>
    
    <footer>
        <div class="container">
            <p>&copy; 2024 John Doe. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;
  }
  
  if (isDashboard) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f6fa; }
        .dashboard { display: grid; grid-template-columns: 250px 1fr; min-height: 100vh; }
        .sidebar { background: linear-gradient(180deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem 1rem; }
        .sidebar h2 { margin-bottom: 2rem; text-align: center; }
        .nav-item { padding: 1rem; margin-bottom: 0.5rem; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; }
        .nav-item:hover { background: rgba(255,255,255,0.1); }
        .main-content { padding: 2rem; }
        .header { background: white; padding: 1rem 2rem; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 2rem; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
        .stat-card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .stat-card h3 { color: #666; font-size: 0.9rem; margin-bottom: 0.5rem; }
        .stat-card .number { font-size: 2rem; font-weight: bold; color: #333; }
        .chart-container { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .chart { height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem; }
        @media (max-width: 768px) { .dashboard { grid-template-columns: 1fr; } .sidebar { padding: 1rem; } }
    </style>
</head>
<body>
    <div class="dashboard">
        <aside class="sidebar">
            <h2>Dashboard</h2>
            <div class="nav-item">📊 Analytics</div>
            <div class="nav-item">👥 Users</div>
            <div class="nav-item">📈 Reports</div>
            <div class="nav-item">⚙️ Settings</div>
        </aside>
        
        <main class="main-content">
            <header class="header">
                <h1>Welcome back, Admin!</h1>
                <p>Here's what's happening with your business today.</p>
            </header>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <h3>Total Users</h3>
                    <div class="number">12,345</div>
                </div>
                <div class="stat-card">
                    <h3>Revenue</h3>
                    <div class="number">$45,678</div>
                </div>
                <div class="stat-card">
                    <h3>Orders</h3>
                    <div class="number">1,234</div>
                </div>
                <div class="stat-card">
                    <h3>Growth</h3>
                    <div class="number">+12%</div>
                </div>
            </div>
            
            <div class="chart-container">
                <h3>Analytics Overview</h3>
                <div class="chart">📈 Chart visualization would go here</div>
            </div>
        </main>
    </div>
</body>
</html>`;
  }
  
  // Default landing page
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Beautiful Landing Page</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; overflow-x: hidden; }
        .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; min-height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; position: relative; }
        .hero::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><polygon fill="rgba(255,255,255,0.1)" points="0,1000 1000,800 1000,1000"/></svg>'); }
        .hero-content { position: relative; z-index: 1; max-width: 800px; padding: 2rem; }
        .hero h1 { font-size: 4rem; margin-bottom: 1rem; animation: fadeInUp 1s ease; }
        .hero p { font-size: 1.3rem; margin-bottom: 2rem; opacity: 0.9; animation: fadeInUp 1s ease 0.3s both; }
        .btn { display: inline-block; background: rgba(255,255,255,0.2); color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 50px; font-weight: bold; transition: all 0.3s ease; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.3); animation: fadeInUp 1s ease 0.6s both; }
        .btn:hover { background: rgba(255,255,255,0.3); transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
        .features { padding: 5rem 0; background: #f8f9fa; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
        .features h2 { text-align: center; margin-bottom: 3rem; font-size: 2.5rem; color: #333; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        .feature-card { background: white; padding: 2rem; border-radius: 12px; text-align: center; box-shadow: 0 5px 15px rgba(0,0,0,0.1); transition: transform 0.3s ease; }
        .feature-card:hover { transform: translateY(-5px); }
        .feature-icon { font-size: 3rem; margin-bottom: 1rem; }
        .feature-card h3 { margin-bottom: 1rem; color: #333; }
        .feature-card p { color: #666; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 768px) { .hero h1 { font-size: 2.5rem; } .hero p { font-size: 1.1rem; } }
    </style>
</head>
<body>
    <section class="hero">
        <div class="hero-content">
            <h1>Welcome to the Future</h1>
            <p>Experience the next generation of web applications with our cutting-edge technology and beautiful design.</p>
            <a href="#features" class="btn">Get Started</a>
        </div>
    </section>
    
    <section class="features" id="features">
        <div class="container">
            <h2>Why Choose Us?</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🚀</div>
                    <h3>Lightning Fast</h3>
                    <p>Optimized for speed and performance to give your users the best experience.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🎨</div>
                    <h3>Beautiful Design</h3>
                    <p>Stunning visual design that captures attention and engages your audience.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📱</div>
                    <h3>Mobile First</h3>
                    <p>Responsive design that works perfectly on all devices and screen sizes.</p>
                </div>
            </div>
        </div>
    </section>
</body>
</html>`;
};
