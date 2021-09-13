import { List, Theme, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import React from 'react';
import ParagraphedListItem from './components/ParagraphedListItem';

const instructions = [
  'Poängen samlas i detta digitala phuxpoängskort genom skanning av QR-kod eller separat godkännande av Phuxivatorn.',
  'Korten gås igenom av Phuxivatorn kontinuerligt.',
  'Varje phux som samlat in de obligatoriska poängen och uppvisat en god TF-anda förtjänar erhålla Teknologmössan eller TF-kokarden och -fodret till den möjliga Walborgen.',
  'Vid fall av prujande eller förfalskande av phuxpoäng indrages samtliga poäng samt möjligheten att få teknologmössan eller TF-kokarden och -fodret till den möjliga Walborg.',
  'Phuxivatorn erhåller rätten att ändra på dessa regler.',
];

const InstructionsList = () => {
  const instructionsList = instructions.map((instruction: string) => (
    <ParagraphedListItem
      index={instructions.indexOf(instruction) + 1}
      content={instruction}
    />
  ));
  return (
    <>
      <Typography variant={'h3'}>Reglemente</Typography>
      <List>{instructionsList}</List>
    </>
  );
};
const useStyles = makeStyles((theme: Theme) => createStyles({}));

export default InstructionsList;
