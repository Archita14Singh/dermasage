
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ClientInfo {
  name: string;
  age: string;
  skinType: string;
  allergies: string;
  medicalHistory: string;
}

interface ClientQuestionnaireProps {
  onComplete: (clientInfo: ClientInfo) => void;
}

const ClientQuestionnaire: React.FC<ClientQuestionnaireProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [skinType, setSkinType] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Make sure all required fields are filled
    if (!name.trim() || !age.trim() || !skinType) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Pass the client info to the parent component
    onComplete({
      name: name.trim(),
      age: age.trim(),
      skinType,
      allergies: allergies.trim(),
      medicalHistory: medicalHistory.trim()
    });
  };
  
  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Tell Us About Yourself</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input 
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Your age"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="skinType">Skin Type</Label>
            <Select
              value={skinType}
              onValueChange={setSkinType}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your skin type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="dry">Dry</SelectItem>
                <SelectItem value="oily">Oily</SelectItem>
                <SelectItem value="combination">Combination</SelectItem>
                <SelectItem value="sensitive">Sensitive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="allergies">Known Allergies</Label>
            <Textarea 
              id="allergies"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="List any allergies to skincare ingredients (if none, leave blank)"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="medicalHistory">Relevant Medical History</Label>
            <Textarea 
              id="medicalHistory"
              value={medicalHistory}
              onChange={(e) => setMedicalHistory(e.target.value)}
              placeholder="Any skin conditions or treatments you're receiving (if none, leave blank)"
            />
          </div>
          
          <CardFooter className="px-0 pt-4">
            <Button type="submit" className="w-full">Submit</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default ClientQuestionnaire;
