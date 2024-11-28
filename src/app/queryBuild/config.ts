"use client";
// Importação dinâmica do QueryBuilder

import type { Config } from 'react-awesome-query-builder';
import {  BasicConfig } from 'react-awesome-query-builder';
import { schema } from './schemas/TableShema';
import settings from './settingsConfig';
const InitialConfig = BasicConfig;

const config: Config = {
    ...InitialConfig,

    fields: schema,
    settings: settings  
      
    
  };

  export default config;