import React, { useEffect, useRef, useState } from 'react';
import ForceGraph3D from '3d-force-graph';
import * as THREE from 'three';
import { GraphData } from '../types/graph';

interface ForceGraphProps {
  data: GraphData;
  darkMode: boolean;
}

const ForceGraph: React.FC<ForceGraphProps> = ({ data, darkMode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const initGraph = () => {
    if (!containerRef.current) {
      setDebugInfo('Container not ready');
      return;
    }

    try {
      setDebugInfo(`Attempting to initialize graph...`);

      // Clear previous instance
      if (graphRef.current) {
        graphRef.current._destructor();
      }
      containerRef.current.innerHTML = '';

      const Graph = ForceGraph3D()(containerRef.current)
        .width(containerRef.current.clientWidth)
        .height(600)
        .backgroundColor(darkMode ? '#000000' : '#ffffff')
        .nodeThreeObject(node => {
          return new THREE.Mesh(
            new THREE.SphereGeometry(node.group === 'root' ? 4 : 2),
            new THREE.MeshPhongMaterial({
              color: getNodeColor(node as any),
              transparent: true,
              opacity: 0.9,
              shininess: 100
            })
          );
        })
        .linkWidth(0.5)
        .linkDirectionalParticles(1)
        .linkDirectionalParticleWidth(0.8)
        .linkOpacity(0.3)
        .graphData(data);

      // Add lights
      const scene = Graph.scene();
      scene.add(new THREE.AmbientLight(0xbbbbbb));
      scene.add(new THREE.DirectionalLight(0xffffff, 0.6));

      // Adjust force layout parameters
      Graph.d3Force('link')?.distance(30);
      Graph.d3Force('charge')?.strength(-50);

      // Set initial camera position and controls
      Graph.cameraPosition({ x: 100, y: 100, z: 100 });
      Graph.controls().enableDamping = true;
      Graph.controls().dampingFactor = 0.1;
      Graph.controls().rotateSpeed = 0.5;
      Graph.controls().zoomSpeed = 0.5;

      // Add camera rotation
      let angle = 0;
      const distance = 150;

      const animate = () => {
        if (graphRef.current) {
          angle += 0.0002;
          const x = distance * Math.sin(angle);
          const z = distance * Math.cos(angle);
          Graph.cameraPosition({
            x,
            y: 20 * Math.sin(angle * 2),
            z
          }, 1000);
          requestAnimationFrame(animate);
        }
      };
      animate();

      graphRef.current = Graph;
      setDebugInfo(`Nodes: ${data.nodes.length}, Links: ${data.links.length}\nGraph initialized successfully`);
    } catch (error) {
      console.error('Error initializing graph:', error);
      setDebugInfo(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getNodeColor = (node: any) => {
    switch (node.group) {
      case 'root':
        return darkMode ? '#ff6b6b' : '#ff4444';
      case 'category':
        return darkMode ? '#69db7c' : '#44ff44';
      default:
        return darkMode ? '#74c0fc' : '#4444ff';
    }
  };

  useEffect(() => {
    initGraph();
    
    return () => {
      if (graphRef.current) {
        graphRef.current._destructor();
      }
    };
  }, [data, darkMode]);

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
        <pre className="text-sm whitespace-pre-wrap">{debugInfo}</pre>
      </div>
      <div 
        ref={containerRef} 
        className="w-full h-[600px] rounded-lg border border-gray-200 dark:border-gray-700"
        style={{ background: darkMode ? '#000000' : '#ffffff' }}
      />
    </div>
  );
};

export default ForceGraph;