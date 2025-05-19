import React, { useState, useEffect } from 'react';
import { Card, Typography, Spin, Alert, Space } from 'antd';
import { 
  BulbOutlined
} from '@ant-design/icons';
import { aiManagerService, AISuggestion } from '../../../../../../../api/ai-manager';

const { Text, Paragraph } = Typography;

interface AIManagerTipsProps {
  projectId?: number;
  sprintId?: number;
}

const AIManagerTips: React.FC<AIManagerTipsProps> = ({ projectId, sprintId }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("Fetching AI Manager suggestions...");
        let response;
        
        if (projectId) {
          console.log(`Fetching project suggestions for project ID: ${projectId}`);
          response = await aiManagerService.getProjectSuggestions(projectId);
        } else if (sprintId) {
          console.log(`Fetching sprint suggestions for sprint ID: ${sprintId}`);
          response = await aiManagerService.getSprintSuggestions(sprintId);
        } else {
          console.log("Fetching comprehensive suggestions");
          response = await aiManagerService.getComprehensiveSuggestions();
        }
        
        console.log("AI Manager API response:", response);
        
        if (response && response.suggestions) {
          setSuggestions(response.suggestions);
        } else {
          console.warn("No suggestions found in the response");
          setSuggestions([]);
        }
      } catch (err) {
        console.error('Error fetching AI suggestions:', err);
        setError('Failed to load managerial suggestions. Please try again later.');
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [projectId, sprintId]);

  // Function to combine similar suggestions
  const combineSimilarSuggestions = (suggestions: AISuggestion[]): string => {
    if (suggestions.length === 0) {
      return "No managerial suggestions available at this time.";
    }

    // For a single suggestion, just return its description
    if (suggestions.length === 1) {
      return suggestions[0].description;
    }

    // For multiple suggestions, combine them intelligently
    const combinedMessage = suggestions.map(suggestion => {
      // First sentence of description for brevity
      const description = suggestion.description.split('.')[0] + '.';
      return `${suggestion.title}: ${description}`;
    }).join(' ');

    return combinedMessage;
  };

  // Get combined suggestion message
  const combinedMessage = combineSimilarSuggestions(suggestions);

  // Determine the most important suggestion type for styling
  const determinePrimaryType = (): "success" | "info" | "warning" | "error" => {
    if (suggestions.some(s => s.type === 'warning')) return 'warning';
    if (suggestions.some(s => s.type === 'success')) return 'success';
    return 'info';
  };

  if (loading) {
    return (
      <Card styles={{ body: { padding: "24px" } }} style={{ marginBottom: "24px" }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60px' }}>
          <Spin tip="Loading managerial insights..." />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card styles={{ body: { padding: "24px" } }} style={{ marginBottom: "24px" }}>
        <Alert message="Error" description={error} type="error" showIcon />
      </Card>
    );
  }

  if (suggestions.length === 0) {
    return (
      <Card styles={{ body: { padding: "24px" } }} style={{ marginBottom: "24px" }}>
        <Alert 
          message="No Managerial Insights Available" 
          description="There are no AI-powered suggestions available at this time." 
          type="info" 
          showIcon
        />
      </Card>
    );
  }

  return (
    <Card 
      styles={{ body: { padding: "24px" } }} 
      style={{ marginBottom: "24px" }}
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <BulbOutlined style={{ fontSize: '20px', marginRight: '8px', color: '#722ed1' }} />
          <span>AI Managerial Insights</span>
        </div>
      }
    >
      <Alert
        message="Management Suggestions"
        description={combinedMessage}
        type={determinePrimaryType()}
        showIcon
        style={{ marginBottom: '8px' }}
      />
      
      {suggestions.length > 1 && (
        <Paragraph style={{ marginTop: '12px', fontSize: '14px', color: '#8c8c8c' }}>
          <Text strong>Action Items:</Text>
          <Space direction="vertical" style={{ marginTop: '8px', width: '100%' }}>
            {suggestions.slice(0, 2).flatMap(suggestion => 
              suggestion.action_items.slice(0, 2).map((item, idx) => (
                <Text key={`${suggestion.title}-${idx}`} style={{ marginLeft: '12px' }}>• {item}</Text>
              ))
            )}
          </Space>
        </Paragraph>
      )}
    </Card>
  );
};

export default AIManagerTips; 