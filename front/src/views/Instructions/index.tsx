import React from 'react';
import { List } from '@mui/material';
import ParagraphedListItem from './components/ParagraphedListItem';

const instructions = [
  'Poängen samlas i detta digitala phuxpoängskort genom skanning av QR-kod eller separat godkännande av Phuxivatorn.',
  'Korten gås igenom av Phuxivatorn kontinuerligt.',
  'Varje phux som samlat in de obligatoriska poängen och uppvisat en god TF-anda förtjänar erhålla Teknologmössan eller TF-kokarden och -fodret till den möjliga Walborgen.',
  'Vid fall av prujande eller förfalskande av phuxpoäng indrages samtliga poäng samt möjligheten att få teknologmössan eller TF-kokarden och -fodret till den möjliga Walborg.',
  'Phuxivatorn erhåller rätten att ändra på dessa regler.',
  'Vid tekniska problem, skicka mail till domppa@tf.fi eller telegram meddelande på @chriau.',
];

const InstructionsList = () => {
  const instructionsList = instructions.map((instruction: string) => (
    <ParagraphedListItem
      index={instructions.indexOf(instruction) + 1}
      content={instruction}
      key={`${instructions.indexOf(instruction) + 1}-index`}
    />
  ));
  return (
    <>
      <List>{instructionsList}</List>
    </>
  );
};

export default InstructionsList;
