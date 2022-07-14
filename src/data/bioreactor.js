/* eslint-disable */

/**
 * Mapping definitions specific for the IDBS BioReactor template
 */
class IDBSBioreactorMap {
  constructor(){}

  sourceSystem () { return 'idbs'; }
  templateName () { return 'Bioreactor'; }
  templateVersion () { return null; }

  isBaseTemplate () { return false; }
  isFinalTemplate () { return false; }

  mappings () {
    return [
      // ======================================================================================================
      // ======================================================================================================
      //                                       New Version
      // ======================================================================================================
      // ======================================================================================================




      // ======================================================================================================
      //                                       Equipment
      // ======================================================================================================

      // Equipment tends to be referenced by lots of other things, so better to map it early


      // Experiment Setup. NB this needs to output a single row table to a literal, not an array
      // Map this after Bioreactor to ensure it populates same equipment object
      {
        "sourcePath": "extractTableByName | 'Experiment Setup'",
        "ldmField": "insertSingleRowTable | idbsBioreactorV2ExperimentSetupMap",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },

      // Project details from Compounds and Projects
      {
        "sourcePath": "extractTableByName | 'Compounds and Projects'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2ProjectsMap",
        "ldmPath": "projects[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "extractTableByName | 'Contributors'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2ContributorsMap",
        "ldmPath": "persons[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      // Bioreactor details. Maps to single equipment[]
      {
        "sourcePath": "extractTableByName | 'Bioreactor Details'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2BioreactorDetailsMap",
        "ldmPath": "equipment[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Bioreactor Details' |'Experiment Setup' | Process Step | Bioreactor Type",
        "ldmField": "enrichLDMTable | idbsBioreactorV2DetailsTypeMap | Equipment ID | equipment",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Bioreactor Details' |'Experiment Setup' | Bioreactor Type | ambr Data Export Path",
        "ldmField": "enrichLDMTable | idbsBioreactorV2DetailsExportPathMap | Equipment ID | equipment",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "extractTableByName | 'Metabolite Data Entry'",
        "ldmField": "insertTableReduceByUniqueKey | idbsBioreactorV2MetaboliteInstrumentMap | Metabolite Type",
        "ldmPath": "equipment[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      // Add on setpoints here (as otherwise there is no key to associate with the bioreactor!)

      {
        "sourcePath": "extractTableByName | 'Vessel Setup'",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ComponentsMap | Reactor ID | equipment | id",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Vessel Setup' | Setpoint Group | 'Setpoints' | Setpoint Name",
        "ldmField": "enrichManyLDMTable | idbsBioreactorV2SetPointSettingsMap | Reactor ID | equipment | id",
        "ldmPath": "settings[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      // Add on vessels here (as otherwise there is no key to associate with the bioreactor).
      // This is the only definition of bioreactor components I can see





      // Other equipment. Maps to multiple equipment[]
      {
        "sourcePath": "extractTableByName | 'Other Equipment Details'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2EquipmentDetailsMap",
        "ldmPath": "equipment[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Centrifugation' | 'UoM_Centrifugation' | Centrifugation Data | UoM",
        "ldmField": "enrichManyLDMTable | idbsBioreactorV2CentrifugationSettingsMap | Centrifuge ID | equipment | id",
        "ldmPath": "settings[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Reactor Daily Data Entry' | 'UoM_Reactor Daily Data Entry' | Parent Data | UoM",
        "ldmField": "enrichManyLDMTable | idbsBioreactorV2ReactorDailyDataEntrySettingsMap | h Reactor ID | equipment | id",
        "ldmPath": "settings[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "extractTableByName | 'Raman Instrumentation'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2RamanInstrumentationMap",
        "ldmPath": "equipment[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "extractTableByName | 'Raman Data'",
        "ldmField": "enrichLastLDMTable | idbsBioreactorV2RamanInstrumentationMap2 | equipment",
        "ldmPath": "location",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Raman Instrument Settings' | 'UoM_Raman Instrument Settings' | Instrument Settings Data | UoM",
        "ldmField": "enrichLastLDMTable | idbsBioreactorV2RamanSettingsMap | equipment",
        "ldmPath": "settings[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Raman Model' | Reactor Index | 'Reactor ID Details",
        "ldmField": "enrichLastLDMTable | idbsBioreactorV2RamanModelMap | equipment",
        "ldmPath": "settings[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Aliquot Sample Details' | 'UoM_Aliquot Sample Details' | Aliquot Sample Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2AliquotSampleDetailsTestMap | DCA ID",
        "ldmPath": "tests[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },

      // ======================================================================================================
      //                                       Materials
      // ======================================================================================================

      {
        "sourcePath": "extractTableByName | 'Item iw Culture'",
        "ldmField": "insertTableReduceByUniqueKey | idbsBioreactorV2RunSummary&PooledMaterialMap | Record system ID (1)",
        "ldmPath": "materials[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "extractTableByName | 'Culture Details'",
        "ldmField": "enrichLDMTable | idbsBioreactorV2RunSummary&PooledMaterialMap2 | Seed Culture Material Record ID | materials",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "extractTableByName | 'Compounds and Projects'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2SubstancesMap | Compound ID",
        "ldmPath": "substances[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      // Culture Details. Maps to multiple materials[]
      {
        "sourcePath": "extractTableByName | 'Culture Details'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2CultureDetailsMap | Seed Culture ID",
        "ldmPath": "lots[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "extractTableByName | 'Culture Details'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2CultureDetailsSubstanceMap | Seed Culture ID",
        "ldmPath": "substances[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "extractTableByName | 'Reagent Details'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2ReagentDetailsMap",
        "ldmPath": "lots[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "extractTableByName | 'Reagent Details'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2ReagentDetailsBatchMap | Lot Number",
        "ldmPath": "batches[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "extractTableByName | 'Other Material Details'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2OtherMaterialsDetailsMap",
        "ldmPath": "lots[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "extractTableByName | 'Other Material Details'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2OtherMaterialsDetailsBatchMap",
        "ldmPath": "batches[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "extractTableByName | 'Complete Medium'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2CompleteMediumBatchMap",
        "ldmPath": "batches[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "extractTableByName | 'Complete Medium'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2CompleteMediumLotMap",
        "ldmPath": "lots[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      // Medium supplementation. This enriches materials[] keyed by an ID
      {
        "sourcePath": "extractTableByName | 'Medium Supplementation'",
        "ldmField": "enrichManyLDMTable | idbsBioreactorV2MediumSupplementationMap | Complete Media Index | lots",
        "ldmPath": "refLot[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },



      // Run summary for Generated Cultures
      {
        "sourcePath": "lookupAndJoinTables | 'Run Summary' | Generated Culture ID | 'Item iw Culture' | Item link",
        "ldmField": "insertTableToLDM | idbsBioreactorV2RunSummaryLotMap | Generated Culture ID",
        "ldmPath": "lots[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Run Summary' | Reactor Index | 'Vessel Setup'",
        "ldmField": "enrichLDMTable | idbsBioreactorV2RunSummaryLotMap2 | Generated Culture ID | lots",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Run Summary' | Generated Culture ID | 'Item iw Culture' | Item link",
        "ldmField": "insertTableToLDM | idbsBioreactorV2RunSummaryBatchMap | Generated Culture ID",
        "ldmPath": "batches[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Pooled Culture Details' | 'UoM_Pooled Culture Details' | Pooled Culture Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2PooledCultureLotMap | Pooled Culture ID",
        "ldmPath": "lots[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Pooled Culture Details' | Pool Material 1 | 'Run Summary' | h Reactor Descriptor",
        "ldmField": "enrichLDMTable | idbsBioreactorV2PooledCultureRefMaterialMap | Pooled Culture ID | lots",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Pooled Culture Details' | Pool Material 2 | 'Run Summary' | h Reactor Descriptor",
        "ldmField": "enrichLDMTable | idbsBioreactorV2PooledCultureRefMaterialMap | Pooled Culture ID | lots",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Pooled Culture Details' | Pool Material 3 | 'Run Summary' | h Reactor Descriptor",
        "ldmField": "enrichLDMTable | idbsBioreactorV2PooledCultureRefMaterialMap | Pooled Culture ID | lots",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "extractTableByName | 'Pooled Culture Details'",
        "ldmField": "enrichLDMTable | idbsBioreactorV2PooledCultureIDMap | Pooled Culture ID | lots",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Pooled Culture Details' | 'UoM_Pooled Culture Details' | Pooled Culture Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2PooledCultureBatchMap | Pooled Culture ID",
        "ldmPath": "batches[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },

      // ======================================================================================================
      //                                       Processes
      // ======================================================================================================


      {
        "sourcePath": "lookupAndJoinPivotTables | 'Parent Sample Details' | 'UoM_Parent Sample Details' | Parent Sample Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2ParentSampleDetailsSampleMap | Sample ID",
        "ldmPath": "samples[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Parent Sample Details' | Reactor Index | 'Run Summary'",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ParentSampleDetailsSampleMap2 | Sample ID | samples",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Aliquot Sample Details' | 'UoM_Aliquot Sample Details' | Aliquot Sample Data | UoM",
        "ldmField": "enrichManyLDMTable | idbsBioreactorV2AliquotSampleDetailsSampleMap | h Parent Sample ID | samples",
        "ldmPath": "aliquot[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      // Complete media. Create process[] for each complete medium
      {
        "sourcePath": "extractTableByName | 'Complete Medium'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2CompleteMediumProcessMap",
        "ldmPath": "processes[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      // Then add references to media supplementation (enriched, keyed by ID)
      {
        "sourcePath": "extractTableByName | 'Medium Supplementation'",
        "ldmField": "enrichManyLDMTable | idbsBioreactorV2MediumSupplementationProcessMap | Complete Media Index | processes",
        "ldmPath": "refLots[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "extractTableByName | 'Complete Medium'",
        "ldmField": "enrichLDMTable | idbsBioreactorV2CompleteMediumProcessIDMap | Complete Media Index | processes",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },

      // Innoculation processes
      {
        "sourcePath": "lookupAndJoinTables | 'Inoculum Details' | Centrifuge group | Centrifugation | h Centrifuge dropdown",
        "ldmField": "insertTableToLDM | idbsBioreactorV2InoculumProcessMap | Culture ID",
        "ldmPath": "processes[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Inoculum Details' | Culture Medium | 'Complete Medium' | Complete Reagent Name",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ExperimentFeedSetupProcessMap2 | Inoculation Idx | processes",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },

      // Feed Setup
      {
        "sourcePath": "extractTableByName | 'Experiment Feed Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2ExperimentFeedSetupProcessMap",
        "ldmPath": "processes[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Experiment Feed Setup' | Feed 1 Inventory Item | 'Complete Medium' | Complete Reagent Name",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ExperimentFeedSetupProcessMap2 | Feed Configuration | processes",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "extractTableByName | 'Experiment Feed Setup'",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ExperimentFeedSetupProcessMap3 | Feed Configuration | processes",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Experiment Feed Setup' | Feed 2 Inventory Item | 'Complete Medium' | Complete Reagent Name",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ExperimentFeedSetupProcessMap2 | Feed Configuration | processes",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "extractTableByName | 'Experiment Feed Setup'",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ExperimentFeedSetupProcessMap4 | Feed Configuration | processes",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Experiment Feed Setup' | Feed 3 Inventory Item | 'Complete Medium' | Complete Reagent Name",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ExperimentFeedSetupProcessMap2 | Feed Configuration | processes",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },

      //Feed Configuration
      {
        "sourcePath": "extractTableByName | 'Feed Configuration'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2FeedConfigurationProcessMap",
        "ldmPath": "processes[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Feed Configuration' | h Feed Inventory Item | 'Complete Medium' | Complete Reagent Name",
        "ldmField": "enrichMultipleToSingleKeyLdmTable | idbsBioreactorV2FeedConfigurationProcessMap2 | Feed Configuration,Day_Index,Feed Number | _ | processes",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },


      // Vessel processes
      {
        "sourcePath": "extractTableByName | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2VesselProcessMap",
        "ldmPath": "processes[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Vessel Setup' | Feed Schedule Group 1 | 'Experiment Feed Setup' | Condition Name",
        "ldmField": "enrichLDMTable | idbsBioreactorV2BioreactorRunRefProcessMap | Reactor Index | processes",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Vessel Setup' | Feed Schedule Group 2 | 'Experiment Feed Setup' | Condition Name",
        "ldmField": "enrichLDMTable | idbsBioreactorV2BioreactorRunRefProcessMap | Reactor Index | processes",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Vessel Setup' | Feed Schedule Group 3 | 'Experiment Feed Setup' | Condition Name",
        "ldmField": "enrichLDMTable | idbsBioreactorV2BioreactorRunRefProcessMap | Reactor Index | processes",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      // Add in process parameters from experiment setup. Note this is done by type, so every Bioreactor run is enriched
      {
        "sourcePath": "extractTableByName | 'Experiment Setup'",
        "ldmField": "enrichLDMTableOfType | idbsBioreactorV2ExperimentSetupProcessParamsMap | Bioreactor Run | processes",
        "ldmPath": "parameters[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "extractTableByName | 'Experiment Setup'",
        "ldmField": "enrichLDMTableOfType | idbsBioreactorV2ExperimentSetupProcessParamsMap2 | Bioreactor Run | processes",
        "ldmPath": "parameters[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "extractTableByName | 'Experiment Setup'",
        "ldmField": "enrichLDMTableOfType | idbsBioreactorV2ExperimentSetupProcessParamsMap3 | Bioreactor Run | processes",
        "ldmPath": "parameters[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Experiment Setup | Perfusion Experiment ? | Yes'
      },
      {
        "sourcePath": "extractTableByName | 'Experiment Setup'",
        "ldmField": "enrichLDMTableOfType | idbsBioreactorV2ExperimentSetupProcessParamsMap5 | Bioreactor Run | processes",
        "ldmPath": "parameters[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Experiment Setup | Perfusion Experiment ? | No'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Vessel Setup' | Setpoint Group | 'Setpoints' | Setpoint Name",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ExperimentSetupProcessParamsMap4 | Reactor Index | processes",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      // Add in generated culture reference from Run Summary
      {
        "sourcePath": "lookupAndJoinTables | 'Run Summary' | Reactor Index | 'Vessel Setup'",
        "ldmField": "enrichManyLDMTable | idbsBioreactorV2RunSummaryProcessParamsMap | Reactor Index | processes",
        "ldmPath": "refBatches[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      // Add in checking parameters from Run Check
      {
        "sourcePath": "extractTableByName | 'Bioreactor Run Check'",
        "ldmField": "enrichLDMTable | idbsBioreactorV2RunCheckProcessParamsMap | Reactor Index | processes",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Run Summary' | Centrifuge group | Centrifugation | h Centrifuge dropdown",
        "ldmField": "enrichManyLDMTable | idbsBioreactorV2BioreactorRunRefEquipmentMap | Reactor Index | processes",
        "ldmPath": "refEquipment[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Vessel Setup' | Reactor Index | 'Reactor ID Details'",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ReactorIdMap | Reactor Index | processes",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },


      // Culture Feeding
      {
        "sourcePath": "lookupAndJoinTables | 'Feed Details' | Reactor Index | 'Vessel Setup'",
        "ldmField": 'insertTableToLDM | idbsBioreactorV2FeedProcessMap',
        "ldmPath": 'processes[]',
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Feed Details' | Feed ID | 'Complete Medium' | Complete Reagent Name",
        "ldmField": "enrichMultipleToSingleKeyLdmTable | idbsBioreactorV2FeedProcessMap2 | Reactor Index,Day_Index,h Feed Number,Feed Index | _ | processes",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Feed Details' | Reactor Index | 'Reactor ID Details'",
        "ldmField": "enrichMultipleToSingleKeyLdmTable | idbsBioreactorV2FeedProcessIDMap | Reactor Index,Day_Index,h Feed Number,Feed Index | _ | processes",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },


      // Sampling processes
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Parent Sample Details' | 'UoM_Parent Sample Details' | Parent Sample Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2ParentSampleDetailsProcessMap | Sample ID",
        "ldmPath": "processes[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Parent Sample Details' | h Reactor Day Concat | 'Reactor Daily Data Entry' | h Reactor and Day",
        "ldmField": 'enrichLDMTable | idbsBioreactorV2ParentSampleProcessEnrichMap | h Parent sample Idx | processes',
        "ldmPath": '',
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Aliquot Sample Details' | 'UoM_Aliquot Sample Details' | Aliquot Sample Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2AliquotSampleDetailsProcessMap | Sample ID",
        "ldmPath": "processes[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Aliquot Sample Details' | Reactor Index | 'Reactor ID Details'",
        "ldmField": "enrichMultipleToSingleKeyLdmTable | idbsBioreactorV2AliquotSampleDetailsProcessIDMap | Reactor Index,Day Index,Parent Sample Index,Aliquot Index | _ | processes",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },


      {
        "sourcePath": "lookupAndJoinPivotTables | 'Pooled Culture Details' | 'UoM_Pooled Culture Details' | Pooled Culture Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2PooledCultureProcessMap | Pooled Culture Idx",
        "ldmPath": "processes[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "extractTableByName | 'Pooled Culture Details'",
        "ldmField": "enrichLDMTable | idbsBioreactorV2PooledCultureRefBatchMap4 | Pooled Culture Idx | processes",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Pooled Culture Details' | Pool Material 1 | 'Run Summary' | h Reactor Descriptor",
        "ldmField": "enrichLDMTable | idbsBioreactorV2PooledCultureRefBatchMap | Pooled Culture Idx | processes",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Pooled Culture Details' | Pool Material 2 | 'Run Summary' | h Reactor Descriptor",
        "ldmField": "enrichLDMTable | idbsBioreactorV2PooledCultureRefBatchMap2 | Pooled Culture Idx | processes",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Pooled Culture Details' | Pool Material 3 | 'Run Summary' | h Reactor Descriptor",
        "ldmField": "enrichLDMTable | idbsBioreactorV2PooledCultureRefBatchMap3 | Pooled Culture Idx | processes",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },

      // ======================================================================================================
      //                                            Results
      // ======================================================================================================

      // ViCell Data Entry
      {
        "sourcePath": "extractTableByName | 'ViCell Data Entry'",
        "ldmField": "insertTableReduceByUniqueKey | idbsBioreactorV2UniqueTestMap | DCA ID",
        "ldmPath": "tests[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'ViCell Data Entry' | 'UoM_ViCell Data Entry' | Cell Count Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2CellCountTotalCellResultMap | Total Cell Concentration",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'ViCell Data Entry' | 'UoM_ViCell Data Entry' | Cell Count Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2CellCountViableCellResultMap | Total Viable Cell Concentration",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'ViCell Data Entry' | 'UoM_ViCell Data Entry' | Cell Count Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2CellCountViabilityResultMap | Cell Culture Viability",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'ViCell Data Entry' | 'UoM_ViCell Data Entry' | Cell Count Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2CellCountCellSizeResultMap | Average Cell Diameter",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },


      //Osmometer Data Entry
      {
        "sourcePath": "extractTableByName | 'Osmometer Data Entry'",
        "ldmField": "insertTableReduceByUniqueKey | idbsBioreactorV2UniqueTestMap | DCA ID",
        "ldmPath": "tests[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Osmometer Data Entry' | 'UoM_Osmometer Data Entry' | Osmometer Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2MetaboliteOsmolalityMap | Osmolality",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },


      //Cedex Data Entry
      {
        "sourcePath": "extractTableByName | 'BioHT Cedex Data Entry'",
        "ldmField": "insertTableReduceByUniqueKey | idbsBioreactorV2UniqueTestMap | DCA ID",
        "ldmPath": "tests[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'BioHT Cedex Data Entry' | 'UoM_BioHT Cedex Data Entry' | Cedex Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2MetaboliteAmmoniaMap | Ammonium Concentration",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'BioHT Cedex Data Entry' | 'UoM_BioHT Cedex Data Entry' | Cedex Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2MetaboliteCalciumMap | Calcium Concentration",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'BioHT Cedex Data Entry' | 'UoM_BioHT Cedex Data Entry' | Cedex Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2MetaboliteGlucoseMap | Glucose Concentration",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'BioHT Cedex Data Entry' | 'UoM_BioHT Cedex Data Entry' | Cedex Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2MetaboliteGlutamineMap | Glutamine Concentration",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'BioHT Cedex Data Entry' | 'UoM_BioHT Cedex Data Entry' | Cedex Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2MetaboliteGlutamateMap | Glutamate Concentration",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'BioHT Cedex Data Entry' | 'UoM_BioHT Cedex Data Entry' | Cedex Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2MetaboliteIronMap | Iron Concentration",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'BioHT Cedex Data Entry' | 'UoM_BioHT Cedex Data Entry' | Cedex Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2MetaboliteLactateMap | Lactate Concentration",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'BioHT Cedex Data Entry' | 'UoM_BioHT Cedex Data Entry' | Cedex Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2MetaboliteLactateMap2 | Lactate dehydrogenase concentration",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'BioHT Cedex Data Entry' | 'UoM_BioHT Cedex Data Entry' | Cedex Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2MetaboliteLdhMap | Titre",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'BioHT Cedex Data Entry' | 'UoM_BioHT Cedex Data Entry' | Cedex Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2MetaboliteMagnesiumMap | Magnesium Concentration",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'BioHT Cedex Data Entry' | 'UoM_BioHT Cedex Data Entry' | Cedex Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2MetabolitePhosphateMap | Phosphate Concentration",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'BioHT Cedex Data Entry' | 'UoM_BioHT Cedex Data Entry' | Cedex Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2MetabolitePotassiumMap | Potassium Concentration",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'BioHT Cedex Data Entry' | 'UoM_BioHT Cedex Data Entry' | Cedex Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2MetaboliteSodiumMap | Sodium Concentration",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },


      //Flex Data Entry
      {
        "sourcePath": "extractTableByName | 'Flex2 Data Entry'",
        "ldmField": "insertTableReduceByUniqueKey | idbsBioreactorV2UniqueTestMap | DCA ID",
        "ldmPath": "tests[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Flex2 Data Entry' | 'UoM_Flex2 Data Entry' | Flex Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2FlexOsmolalityMap | Osmolality",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Flex2 Data Entry' | 'UoM_Flex2 Data Entry' | Flex Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2FlexAmmoniaMap | Ammonium Concentration",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Flex2 Data Entry' | 'UoM_Flex2 Data Entry' | Flex Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2FlexCalciumMap | Calcium Concentration",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Flex2 Data Entry' | 'UoM_Flex2 Data Entry' | Flex Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2FlexGlucoseMap | Glucose Concentration",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Flex2 Data Entry' | 'UoM_Flex2 Data Entry' | Flex Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2FlexGlutamineMap | Glutamine Concentration",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Flex2 Data Entry' | 'UoM_Flex2 Data Entry' | Flex Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2FlexGlutamateMap | Glutamate Concentration",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Flex2 Data Entry' | 'UoM_Flex2 Data Entry' | Flex Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2FlexLactateMap | Lactate Concentration",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Flex2 Data Entry' | 'UoM_Flex2 Data Entry' | Flex Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2FlexPotassiumMap | Potassium Concentration",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Flex2 Data Entry' | 'UoM_Flex2 Data Entry' | Flex Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2FlexSodiumMap | Sodium Concentration",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Flex2 Data Entry' | 'UoM_Flex2 Data Entry' | Flex Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2MetaboliteCO2Map | pCO2",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Flex2 Data Entry' | 'UoM_Flex2 Data Entry' | Flex Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2MetaboliteCO2TempMap | pCO2 at temperature",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Flex2 Data Entry' | 'UoM_Flex2 Data Entry' | Flex Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2MetaboliteO2Map | pO2",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Flex2 Data Entry' | 'UoM_Flex2 Data Entry' | Flex Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2MetaboliteO2TempMap | pO2 at Temperature",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Flex2 Data Entry' | 'UoM_Flex2 Data Entry' | Flex Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2MetabolitepHMap | pH",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Flex2 Data Entry' | 'UoM_Flex2 Data Entry' | Flex Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2MetabolitepHTempMap | pH at Temperature",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Flex2 Data Entry' | 'UoM_Flex2 Data Entry' | Flex Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2MetaboliteCellDensityMap | Total Cell Concentration",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Flex2 Data Entry' | 'UoM_Flex2 Data Entry' | Flex Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2MetaboliteViableCellDensityMap | Total Viable Cell Concentration",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },


      //RAPIDPoint 500 Data Entry
      {
        "sourcePath": "extractTableByName | 'RAPIDPoint 500 Data Entry'",
        "ldmField": "insertTableReduceByUniqueKey | idbsBioreactorV2UniqueTestMap | DCA ID",
        "ldmPath": "tests[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'RAPIDPoint 500 Data Entry' | 'UoM_RAPIDPoint 500 Data Entry' | RAPIDPoint Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2RapidCalciumMap | Calcium Concentration",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'RAPIDPoint 500 Data Entry' | 'UoM_RAPIDPoint 500 Data Entry' | RAPIDPoint Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2RapidGlucoseMap | Glucose Concentration",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'RAPIDPoint 500 Data Entry' | 'UoM_RAPIDPoint 500 Data Entry' | RAPIDPoint Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2RapidLactateMap | Lactate Concentration",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'RAPIDPoint 500 Data Entry' | 'UoM_RAPIDPoint 500 Data Entry' | RAPIDPoint Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2RapidPotassiumMap | Potassium Concentration",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'RAPIDPoint 500 Data Entry' | 'UoM_RAPIDPoint 500 Data Entry' | RAPIDPoint Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2RapidSodiumMap | Sodium Concentration",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'RAPIDPoint 500 Data Entry' | 'UoM_RAPIDPoint 500 Data Entry' | RAPIDPoint Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2RapidChlorideMap | Chloride Concentration",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'RAPIDPoint 500 Data Entry' | 'UoM_RAPIDPoint 500 Data Entry' | RAPIDPoint Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2RapidCO2Map | pCO2",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'RAPIDPoint 500 Data Entry' | 'UoM_RAPIDPoint 500 Data Entry' | RAPIDPoint Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2RapidCO2TempMap | pCO2 at temperature",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'RAPIDPoint 500 Data Entry' | 'UoM_RAPIDPoint 500 Data Entry' | RAPIDPoint Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2RapidO2Map | pO2",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'RAPIDPoint 500 Data Entry' | 'UoM_RAPIDPoint 500 Data Entry' | RAPIDPoint Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2RapidO2TempMap | pO2 at Temperature",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'RAPIDPoint 500 Data Entry' | 'UoM_RAPIDPoint 500 Data Entry' | RAPIDPoint Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2RapidpHMap | pH",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'RAPIDPoint 500 Data Entry' | 'UoM_RAPIDPoint 500 Data Entry' | RAPIDPoint Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2RapidpHTempMap | pH at Temperature",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'RAPIDPoint 500 Data Entry' | 'UoM_RAPIDPoint 500 Data Entry' | RAPIDPoint Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2RapidTempMap | Temperature",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },


      //YSI Data Entry
      {
        "sourcePath": "extractTableByName | 'YSI Data Entry'",
        "ldmField": "insertTableReduceByUniqueKey | idbsBioreactorV2UniqueTestMap | DCA ID",
        "ldmPath": "tests[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'YSI Data Entry' | 'UoM_YSI Data Entry' | YSI Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2YSIGlucoseMap | Glucose Concentration",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'YSI Data Entry' | 'UoM_YSI Data Entry' | YSI Data | UoM",
        "ldmField": "insertTableToLDM | idbsBioreactorV2YSILactateMap | Lactate Concentration",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },


      //Octet or HPLC Data Entry
      {
        "sourcePath": "extractTableByName | 'Octet or HPLC Data Entry'",
        "ldmField": "insertTableReduceByUniqueKey | idbsBioreactorV2UniqueTestMap | DCA ID",
        "ldmPath": "tests[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "extractTableByName | 'Octet or HPLC Data Entry'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2OctetHPLCMap | Titer",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },



      // aggregatedResults
      //Reactor Daily Data Entry
      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | h Reactor Day Concat | 'Reactor Daily Data Entry' | h Reactor and Day",
        "ldmField": "insertTableToLDM | idbsBioreactorV2DailyEntryProcessResultsCommonMap | right.Cumulative Base Consumed",
        "ldmPath": "aggregatedResults[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | h Reactor Day Concat | 'Reactor Daily Data Entry' | h Reactor and Day",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultCumulativeBaseMap | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Process Results' | 'UoM_Reactor Daily Data Entry' | Parent Data | UoM",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultCumulativeBaseMap2 | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | Reactor Index | 'Vessel Setup'",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultRefCompMap | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },

      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | h Reactor Day Concat | 'Reactor Daily Data Entry' | h Reactor and Day",
        "ldmField": "insertTableToLDM | idbsBioreactorV2DailyEntryProcessResultsCommonMap | right.Cumulative Liquid Acid Fed",
        "ldmPath": "aggregatedResults[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | h Reactor Day Concat | 'Reactor Daily Data Entry' | h Reactor and Day",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultCumulativeAcidMap | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Process Results' | 'UoM_Reactor Daily Data Entry' | Parent Data | UoM",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultCumulativeAcidMap2 | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | Reactor Index | 'Vessel Setup'",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultRefCompMap2 | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },

      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | h Reactor Day Concat | 'Reactor Daily Data Entry' | h Reactor and Day",
        "ldmField": "insertTableToLDM | idbsBioreactorV2DailyEntryProcessResultsCommonMap | right.Antifoam Added?",
        "ldmPath": "aggregatedResults[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | h Reactor Day Concat | 'Reactor Daily Data Entry' | h Reactor and Day",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultAntifoamMap | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | Reactor Index | 'Vessel Setup'",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultRefCompMap3 | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },

      // Process Results
      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2ProcessResultsCommonMap | Growth Rate",
        "ldmPath": "aggregatedResults[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | h Reactor Day Concat | 'Reactor Daily Data Entry' | h Reactor and Day",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultCommentMap | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Process Results' | 'UoM_Process Results' | Result Data | UoM",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultGrowthRateMap | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },

      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2ProcessResultsCommonMap | Doubling Time",
        "ldmPath": "aggregatedResults[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | h Reactor Day Concat | 'Reactor Daily Data Entry' | h Reactor and Day",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultCommentMap | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Process Results' | 'UoM_Process Results' | Result Data | UoM",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultDoublingTimeMap | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },

      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2ProcessResultsCommonMap | Incremental IVCD",
        "ldmPath": "aggregatedResults[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | h Reactor Day Concat | 'Reactor Daily Data Entry' | h Reactor and Day",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultCommentMap | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Process Results' | 'UoM_Process Results' | Result Data | UoM",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultIncrementalIVCDMap | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },

      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2ProcessResultsCommonMap | Cumulative IVCD",
        "ldmPath": "aggregatedResults[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | h Reactor Day Concat | 'Reactor Daily Data Entry' | h Reactor and Day",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultCommentMap | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Process Results' | 'UoM_Process Results' | Result Data | UoM",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultCumulativeIVCDMap | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },

      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2ProcessResultsCommonMap | Total Cell Concentration",
        "ldmPath": "aggregatedResults[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | h Reactor Day Concat | 'Reactor Daily Data Entry' | h Reactor and Day",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultCommentMap | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Process Results' | 'UoM_Process Results' | Result Data | UoM",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultTotalCellDensityMap | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },

      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2ProcessResultsCommonMap | Total Viable Cell Concentration",
        "ldmPath": "aggregatedResults[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | h Reactor Day Concat | 'Reactor Daily Data Entry' | h Reactor and Day",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultCommentMap | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Process Results' | 'UoM_Process Results' | Result Data | UoM",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultViableCellDensityMap | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },

      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2ProcessResultsCommonMap | Cell Culture Viability",
        "ldmPath": "aggregatedResults[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | h Reactor Day Concat | 'Reactor Daily Data Entry' | h Reactor and Day",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultCommentMap | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Process Results' | 'UoM_Process Results' | Result Data | UoM",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultViabilityMap | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },

      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2ProcessResultsCommonMap | Average Cell Diameter",
        "ldmPath": "aggregatedResults[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | h Reactor Day Concat | 'Reactor Daily Data Entry' | h Reactor and Day",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultCommentMap | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Process Results' | 'UoM_Process Results' | Result Data | UoM",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultCellSizeMap | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },

      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2ProcessResultsCommonMap | Titer - Cedex Bio HT",
        "ldmPath": "aggregatedResults[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | h Reactor Day Concat | 'Reactor Daily Data Entry' | h Reactor and Day",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultCommentMap | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Process Results' | 'UoM_Process Results' | Result Data | UoM",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultTiterCedexBioHTMap | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },

      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2ProcessResultsCommonMap | Titer - HPLC/Octet",
        "ldmPath": "aggregatedResults[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | h Reactor Day Concat | 'Reactor Daily Data Entry' | h Reactor and Day",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultCommentMap | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Process Results' | 'UoM_Process Results' | Result Data | UoM",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultTiterHPLCMap | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },

      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2ProcessResultsCommonMap | Specific Productivity - Cedex Bio HP",
        "ldmPath": "aggregatedResults[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | h Reactor Day Concat | 'Reactor Daily Data Entry' | h Reactor and Day",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultCommentMap | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Process Results' | 'UoM_Process Results' | Result Data | UoM",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultSpecificProductivityCedexBioHPMap | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },

      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2ProcessResultsCommonMap | Specific Productivity - HPLC",
        "ldmPath": "aggregatedResults[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | h Reactor Day Concat | 'Reactor Daily Data Entry' | h Reactor and Day",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultCommentMap | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Process Results' | 'UoM_Process Results' | Result Data | UoM",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultSpecificProductivityHPLCMap | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },

      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2ProcessResultsCommonMap | Controller pH",
        "ldmPath": "aggregatedResults[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | h Reactor Day Concat | 'Reactor Daily Data Entry' | h Reactor and Day",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultCommentMap | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Process Results' | 'UoM_Process Results' | Result Data | UoM",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultControllerpHMap | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },

      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2ProcessResultsCommonMap | Controller DO",
        "ldmPath": "aggregatedResults[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | h Reactor Day Concat | 'Reactor Daily Data Entry' | h Reactor and Day",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultCommentMap | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Process Results' | 'UoM_Process Results' | Result Data | UoM",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultControllerDOMap | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },

      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2ProcessResultsCommonMap | Controller Agitation",
        "ldmPath": "aggregatedResults[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | h Reactor Day Concat | 'Reactor Daily Data Entry' | h Reactor and Day",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultCommentMap | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Process Results' | 'UoM_Process Results' | Result Data | UoM",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultControllerAgitationMap | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },

      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2ProcessResultsCommonMap | Controller Temperature",
        "ldmPath": "aggregatedResults[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | h Reactor Day Concat | 'Reactor Daily Data Entry' | h Reactor and Day",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultCommentMap | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Process Results' | 'UoM_Process Results' | Result Data | UoM",
        "ldmField": "enrichLDMTable | idbsBioreactorV2ProcessResultControllerTemperatureMap | h parent concat | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },



      // Run Summary
      {
        "sourcePath": "lookupAndJoinTables | 'Run Summary' | Reactor Index | 'Vessel Setup'",
        "ldmField": 'insertTableToLDM |  idbsBioreactorV2RunSummaryResultDurationMap | Run Duration (Days)',
        "ldmPath": 'aggregatedResults[]',
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Run Summary' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2RunSummaryResultFinalVolumeMap | Final Volume (mL)",
        "ldmPath": "aggregatedResults[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },


      // Result Summary
      {
        "sourcePath": "lookupAndJoinTables | 'Result Summary' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2ResultSummaryCommonMap | IVCD",
        "ldmPath": "aggregatedResults[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Result Summary' | 'UoM_Result Summary' | Run Summary Data | UoM",
        "ldmField": "enrichLDMTable | idbsBioreactorV2RunSummaryResultIVCDMap | Reactor Index | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Result Summary' | Reactor Index | 'Reactor ID Details'",
        "ldmField": "enrichLDMTable | idbsBioreactorV2RunSummaryResultIVCDMap2 | Reactor Index | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },

      {
        "sourcePath": "lookupAndJoinTables | 'Result Summary' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2ResultSummaryCommonMap | Average Growth Rate",
        "ldmPath": "aggregatedResults[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Result Summary' | 'UoM_Result Summary' | Run Summary Data | UoM",
        "ldmField": "enrichLDMTable | idbsBioreactorV2RunSummaryResultAverageGrowthMap | Reactor Index | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Result Summary' | Reactor Index | 'Reactor ID Details'",
        "ldmField": "enrichLDMTable | idbsBioreactorV2RunSummaryResultAverageGrowthMap2 | Reactor Index | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },

      {
        "sourcePath": "lookupAndJoinTables | 'Result Summary' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2ResultSummaryCommonMap | Maximum Viable Cell Density",
        "ldmPath": "aggregatedResults[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Result Summary' | 'UoM_Result Summary' | Run Summary Data | UoM",
        "ldmField": "enrichLDMTable | idbsBioreactorV2RunSummaryResultMaxViableCellDensityMap | Reactor Index | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Result Summary' | Reactor Index | 'Reactor ID Details'",
        "ldmField": "enrichLDMTable | idbsBioreactorV2RunSummaryResultMaxViableCellDensityMap2 | Reactor Index | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },

      {
        "sourcePath": "lookupAndJoinTables | 'Result Summary' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2ResultSummaryCommonMap | Final Viable Cell Density",
        "ldmPath": "aggregatedResults[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Result Summary' | 'UoM_Result Summary' | Run Summary Data | UoM",
        "ldmField": "enrichLDMTable | idbsBioreactorV2RunSummaryResultFinalViableCellDensityMap | Reactor Index | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Result Summary' | Reactor Index | 'Reactor ID Details'",
        "ldmField": "enrichLDMTable | idbsBioreactorV2RunSummaryResultFinalViableCellDensityMap2 | Reactor Index | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },

      {
        "sourcePath": "lookupAndJoinTables | 'Result Summary' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2ResultSummaryCommonMap | Final Viability",
        "ldmPath": "aggregatedResults[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Result Summary' | 'UoM_Result Summary' | Run Summary Data | UoM",
        "ldmField": "enrichLDMTable | idbsBioreactorV2RunSummaryResultFinalViabilityMap | Reactor Index | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Result Summary' | Reactor Index | 'Reactor ID Details'",
        "ldmField": "enrichLDMTable | idbsBioreactorV2RunSummaryResultFinalViabilityMap2 | Reactor Index | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },

      {
        "sourcePath": "lookupAndJoinTables | 'Result Summary' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2ResultSummaryCommonMap | Final Titer Cedex Bio HT",
        "ldmPath": "aggregatedResults[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Result Summary' | 'UoM_Result Summary' | Run Summary Data | UoM",
        "ldmField": "enrichLDMTable | idbsBioreactorV2RunSummaryResultFinalTiterCedexMap | Reactor Index | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Result Summary' | Reactor Index | 'Reactor ID Details'",
        "ldmField": "enrichLDMTable | idbsBioreactorV2RunSummaryResultFinalTiterCedexMap2 | Reactor Index | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },

      {
        "sourcePath": "lookupAndJoinTables | 'Result Summary' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2ResultSummaryCommonMap | Final Titer HPLC",
        "ldmPath": "aggregatedResults[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Result Summary' | 'UoM_Result Summary' | Run Summary Data | UoM",
        "ldmField": "enrichLDMTable | idbsBioreactorV2RunSummaryResultFinalTiterHplcMap | Reactor Index | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Result Summary' | Reactor Index | 'Reactor ID Details'",
        "ldmField": "enrichLDMTable | idbsBioreactorV2RunSummaryResultFinalTiterHplcMap2 | Reactor Index | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },

      {
        "sourcePath": "lookupAndJoinTables | 'Result Summary' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2ResultSummaryCommonMap | Average Specific Productivity Cedex Bio HT",
        "ldmPath": "aggregatedResults[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Result Summary' | 'UoM_Result Summary' | Run Summary Data | UoM",
        "ldmField": "enrichLDMTable | idbsBioreactorV2RunSummaryResultSpecificProductivityCedexMap | Reactor Index | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Result Summary' | Reactor Index | 'Reactor ID Details'",
        "ldmField": "enrichLDMTable | idbsBioreactorV2RunSummaryResultSpecificProductivityCedexMap2 | Reactor Index | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },

      {
        "sourcePath": "lookupAndJoinTables | 'Result Summary' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorV2ResultSummaryCommonMap | Average Specific Productivity HPLC",
        "ldmPath": "aggregatedResults[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinPivotTables | 'Result Summary' | 'UoM_Result Summary' | Run Summary Data | UoM",
        "ldmField": "enrichLDMTable | idbsBioreactorV2RunSummaryResultSpecificProductivityHplcMap | Reactor Index | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Result Summary' | Reactor Index | 'Reactor ID Details'",
        "ldmField": "enrichLDMTable | idbsBioreactorV2RunSummaryResultSpecificProductivityHplcMap2 | Reactor Index | aggregatedResults",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Parent Sample Details | c Control | c Filterc'
      },





      // ======================================================================================================
      // ======================================================================================================
      //                                       Old Version
      // ======================================================================================================
      // ======================================================================================================



      // ======================================================================================================
      //                                       Equipment
      // ======================================================================================================

      // Equipment tends to be referenced by lots of other things, so better to map it early

      // Bioreactor details. Maps to single equipment[]
      {
        "sourcePath": "extractTableByName | 'Bioreactor Details'",
        "ldmField": "insertTableToLDM | idbsBioreactorBioreactorDetailsMap",
        "ldmPath": "equipment[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "extractTableByName | 'Metabolite Data Entry'",
        "ldmField": "insertTableReduceByUniqueKey | idbsBioreactorMetaboliteInstrumentMap | Metabolite Type",
        "ldmPath": "equipment[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      // Add on setpoints here (as otherwise there is no key to associate with the bioreactor!)
      {
        "sourcePath": "lookupAndJoinTables | 'Vessel Setup' | Setpoint Group | 'Setpoints' | Setpoint Name",
        "ldmField": "enrichManyLDMTable | idbsBioreactorSetPointSettingsMap | Reactor ID | equipment | id",
        "ldmPath": "settings[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      // Add on vessels here (as otherwise there is no key to associate with the bioreactor).
      // This is the only definition of bioreactor components I can see
      {
        "sourcePath": "lookupAndJoinTables | 'Vessel Setup' | Reactor Index | 'Reactor ID Details'",
        "ldmField": "enrichManyLDMTable | idbsBioreactorBioreactorVesselMap | Reactor ID | equipment | id",
        "ldmPath": "components[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },



      // Experiment Setup. NB this needs to output a single row table to a literal, not an array
      // Map this after Bioreactor to ensure it populates same equipment object
      {
        "sourcePath": "extractTableByName | 'Experiment Setup'",
        "ldmField": "insertSingleRowTable | idbsBioreactorExperimentSetupMap",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },

      // Project details from Compounds and Projects
      {
        "sourcePath": "extractTableByName | 'Compounds and Projects'",
        "ldmField": "insertTableToLDM | idbsBioreactorProjectsMap",
        "ldmPath": "projects[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },

      // Other equipment. Maps to multiple equipment[]
      {
        "sourcePath": "extractTableByName | 'Other Equipment Details'",
        "ldmField": "insertTableToLDM | idbsBioreactorEquipmentDetailsMap",
        "ldmPath": "equipment[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },

      // ======================================================================================================
      //                                       Materials
      // ======================================================================================================

      // Culture Details. Maps to multiple materials[]
      {
        "sourcePath": "extractTableByName | 'Culture Details'",
        "ldmField": "insertTableToLDM | idbsBioreactorCultureDetailsMap | Seed Culture ID",
        "ldmPath": "materials[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      // Reagent and other materials details. Maps to multiple materials[]
      {
        "sourcePath": "extractTableByName | 'Reagent Details'",
        "ldmField": "insertTableToLDM | idbsBioreactorReagentDetailsMap",
        "ldmPath": "materials[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "extractTableByName | 'Other Material Details'",
        "ldmField": "insertTableToLDM | idbsBioreactorOtherMaterialsDetailsMap",
        "ldmPath": "materials[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      // Inoculation materials Setup
      {
        "sourcePath": "extractTableByName | 'Inoculum Details'",
        "ldmField": "enrichLDMTable | idbsBioreactorInoculumDetailsMap | Culture ID | materials",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      // Run summary for Generated Cultures
      {
        "sourcePath": "extractTableByName | 'Run Summary'",
        "ldmField": "insertTableToLDM | idbsBioreactorRunSummaryMaterialsMap | Generated Culture ID",
        "ldmPath": "materials[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },


      // ======================================================================================================
      //                                       Samples
      // ======================================================================================================

      // Sampling
      {
        "sourcePath": "extractTableByName | 'Sampling'",
        "ldmField": "insertTableToLDM | idbsBioreactorSamplingMap | Sample ID",
        "ldmPath": "samples[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      // Analytical Sample Submissions, which populate one:many aliquots of parent samples via Parent Sample ID
      {
        "sourcePath": "extractTableByName | 'Analytical Sample Submissions'",
        "ldmField": "enrichManyLDMTable | idbsBioreactorAnalyticalSampleMap | Parent Sample | samples",
        "ldmPath": "aliquot[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },

      // ======================================================================================================
      //                                        Assays
      // ======================================================================================================

      // Assays derived from analytical samples
      {
        "sourcePath": "extractTableByName | 'Analytical Sample Submissions'",
        "ldmField": "insertTableToLDM | idbsBioreactorAnalyticalSampleAssayMap | Analytical Assay",
        "ldmPath": "assays[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },

      // ======================================================================================================
      //                                       Processes
      // ======================================================================================================

      // Innoculation processes
      {
        "sourcePath": "extractTableByName | 'Inoculum Details'",
        "ldmField": "insertTableToLDM | idbsBioreactorInoculumProcessMap | Culture ID",
        "ldmPath": "processes[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },

      // Vessel processes
      {
        "sourcePath": "extractTableByName | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorVesselProcessMap",
        "ldmPath": "processes[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      // Add in process parameters from experiment setup. Note this is done by type, so every Bioreactor run is enriched
      {
        "sourcePath": "extractTableByName | 'Experiment Setup'",
        "ldmField": "enrichLDMTableOfType | idbsBioreactorExperimentSetupProcessParamsMap | Bioreactor Run | processes",
        "ldmPath": "parameters[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      // Add in generated culture reference from Run Summary
      {
        "sourcePath": "extractTableByName | 'Run Summary'",
        "ldmField": "enrichManyLDMTable | idbsBioreactorRunSummaryProcessParamsMap | Reactor Index | processes",
        "ldmPath": "refMaterials[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      // Add in checking parameters from Run Check
      {
        "sourcePath": "extractTableByName | 'Bioreactor Run Check'",
        "ldmField": "enrichLDMTable | idbsBioreactorRunCheckProcessParamsMap | Reactor Index | processes",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Vessel Setup' | Reactor Index | 'Reactor ID Details'",
        "ldmField": "enrichLDMTable | idbsBioreactorVesselProcessMap2 | Reactor Index | processes",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },


      // ----- Media

      // Complete media. Maps to multiple materials[] for each complete medium
      {
        "sourcePath": "extractTableByName | 'Complete Medium'",
        "ldmField": "insertTableToLDM | idbsBioreactorCompleteMediumMaterialsMap",
        "ldmPath": "materials[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      // Medium supplementation. This enriches materials[] keyed by an ID
      {
        "sourcePath": "extractTableByName | 'Medium Supplementation'",
        "ldmField": "enrichManyLDMTable | idbsBioreactorMediumSupplementationMap | Complete Media Index | materials",
        "ldmPath": "refMaterials[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      // Complete media. Create process[] for each complete medium
      {
        "sourcePath": "extractTableByName | 'Complete Medium'",
        "ldmField": "insertTableToLDM | idbsBioreactorCompleteMediumProcessMap",
        "ldmPath": "processes[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      // Then add references to media supplementation (enriched, keyed by ID)
      {
        "sourcePath": "extractTableByName | 'Medium Supplementation'",
        "ldmField": "enrichManyLDMTable | idbsBioreactorMediumSupplementationProcessMap | Complete Media Index | processes | name ",
        "ldmPath": "refMaterials[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },

      // Culture Feeding
      {
        "sourcePath": "lookupAndJoinTables | 'Feed Details' | Reactor Index | 'Vessel Setup'",
        "ldmField": 'insertTableToLDM | idbsBioreactorFeedProcessMap | Feed ID ',
        "ldmPath": 'processes[]',
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Feed Details' | Reactor Index | 'Reactor ID Details'",
        "ldmField": 'enrichLDMTable | idbsBioreactorFeedProcessMap2 | Feed ID | processes',
        "ldmPath": '',
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      // Then add references to complete medium, keyed by name (as strangely ID is not supplied - this is perhaps a step
      // we shouldn't do). Currently apply the complete medium to every "Culture Feeding" item
      {
        "sourcePath": "extractTableByName | 'Complete Medium'",
        "ldmField": "enrichLDMTableOfType | idbsBioreactorCompleteMediumFeedProcessMap | Culture Feeding | processes",
        "ldmPath": "refMaterials[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },

      // Sampling processes

      {
        "sourcePath": "lookupAndJoinTables | 'Sampling' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorSamplingProcessMap | Sample ID",
        "ldmPath": "processes[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Sampling' | Reactor Index | 'Reactor ID Details'",
        "ldmField": "enrichLDMTable | idbsBioreactorSamplingProcessMap2 | Sample ID | processes",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Analytical Sample Submissions' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorAnalyticalSampleProcessMap | Test ID",
        "ldmPath": "processes[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Analytical Sample Submissions' | Reactor Index | 'Reactor ID Details'",
        "ldmField": "enrichLDMTable | idbsBioreactorAnalyticalSampleProcessMap2 | Test ID | processes",
        "ldmPath": "",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },

      // ======================================================================================================
      //                                            Instruments
      // ======================================================================================================

      // Metabolite Data Entry. There is no explicit table for the instruments recorded here - so we have to
      // generate them by reducing the table by the unique name (incongruously in the "Metabolite Type" field)

      // ======================================================================================================
      //                                            Results
      // ======================================================================================================

      // Cell Count Data Entry
      {
        "sourcePath": "lookupAndJoinTables | 'Cell Count Data Entry' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorCellCountTotalCellResultMap | Total Cell Density (1E6 cells/mL)",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Cell Count Data Entry' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorCellCountViableCellResultMap | Viable Cell Density (1E06 cells/mL)",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Cell Count Data Entry' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorCellCountViabilityResultMap | Viability (%)",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Cell Count Data Entry' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorCellCountCellSizeResultMap | Cell Size (µm)",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },

      // Metabolite Data Entry
      {
        "sourcePath": "lookupAndJoinTables | 'Metabolite Data Entry' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorMetaboliteAmmoniaMap | Ammonia (mM)",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Metabolite Data Entry' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorMetaboliteOsmolalityMap | Osmolality (mOmo/kg)",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Metabolite Data Entry' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorMetaboliteCalciumMap | Calcium (mM)",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Metabolite Data Entry' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorMetaboliteGlucoseMap | Glucose (g/L)",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Metabolite Data Entry' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorMetaboliteGlutamineMap | Glutamine (mMl)",  /// Sic!!
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Metabolite Data Entry' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorMetaboliteGlutamateMap | Glutamate (mM)",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Metabolite Data Entry' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorMetaboliteIronMap | Iron (µmol/l)",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Metabolite Data Entry' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorMetaboliteLactateMap | Lactate (g/L)",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Metabolite Data Entry' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorMetaboliteLdhMap | LDH (U/L)",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Metabolite Data Entry' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorMetaboliteMagnesiumMap | Megnesium (mmol/l)",  // SIC!
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Metabolite Data Entry' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorMetabolitePhosphateMap | Phosphate (mmol/l)",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Metabolite Data Entry' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorMetabolitePotassiumMap | Potassium (mM)",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Metabolite Data Entry' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorMetaboliteSodiumMap | Sodium (mM)",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Metabolite Data Entry' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorMetaboliteCO2Map | pCO2 (mmHg)",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Metabolite Data Entry' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorMetaboliteCO2TempMap | CO2 at temperature",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Metabolite Data Entry' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorMetaboliteO2Map | pO2 (mmHg)",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Metabolite Data Entry' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorMetaboliteO2TempMap | O2 at Temperature",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Metabolite Data Entry' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorMetabolitepHMap | pH",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Metabolite Data Entry' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorMetabolitepHTempMap | pH at Temperature",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Metabolite Data Entry' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorMetaboliteCellDensityMap | Total Cell Density (1E6 cells/mL)",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Metabolite Data Entry' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorMetaboliteViableCellDensityMap | Total Viable Cell Density (1E6cells/mL)",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Metabolite Data Entry' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorMetaboliteChlorideMap | Chloride (mmol/l)",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Metabolite Data Entry' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorMetaboliteTiterMap | Titer (mg/L)",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },

      // Process Results
      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorProcessResultGrowthRateMap | Growth Rate (1/Day)",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorProcessResultDoublingTimeMap | Doubling Time (Days)",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorProcessResultIncrementalIVCDMap | Incremental IVCD (1E6)",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Process Results' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorProcessResultCumulativeIVCDMap | Cumulative IVCD (1E6)",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },

      // Run Summary
      {
        "sourcePath": "lookupAndJoinTables | 'Run Summary' | Reactor Index | 'Vessel Setup'",
        "ldmField": 'insertTableToLDM |  idbsBioreactorRunSummaryResultDurationMap | Run Duration (Days)',
        "ldmPath": 'results[]',
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Run Summary' | Reactor Index | 'Reactor ID Details'",
        "ldmField": 'enrichLDMTable |  idbsBioreactorRunSummaryProcessIdMap | Reactor Index | results | refProcessId',
        "ldmPath": '',
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },


      {
        "sourcePath": "lookupAndJoinTables | 'Run Summary' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorRunSummaryResultIVCDMap | IVCD",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Run Summary' | Reactor Index | 'Reactor ID Details'",
        "ldmField": 'enrichLDMTable |  idbsBioreactorRunSummaryProcessIdMap | Reactor Index | results | refProcessId',
        "ldmPath": '',
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },


      {
        "sourcePath": "lookupAndJoinTables | 'Run Summary' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorRunSummaryResultAverageGrowthMap | Average Growth Rate (1/Day)",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Run Summary' | Reactor Index | 'Reactor ID Details'",
        "ldmField": 'enrichLDMTable |  idbsBioreactorRunSummaryProcessIdMap | Reactor Index | results | refProcessId',
        "ldmPath": '',
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },


      {
        "sourcePath": "lookupAndJoinTables | 'Run Summary' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorRunSummaryResultMaxViableCellDensityMap | Maximum Viable Cell Density (1E06 cells/mL)",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Run Summary' | Reactor Index | 'Reactor ID Details'",
        "ldmField": 'enrichLDMTable |  idbsBioreactorRunSummaryProcessIdMap | Reactor Index | results | refProcessId',
        "ldmPath": '',
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },


      {
        "sourcePath": "lookupAndJoinTables | 'Run Summary' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorRunSummaryResultFinalViabilityMap | Final Viability (%)",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Run Summary' | Reactor Index | 'Reactor ID Details'",
        "ldmField": 'enrichLDMTable |  idbsBioreactorRunSummaryProcessIdMap | Reactor Index | results | refProcessId',
        "ldmPath": '',
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },


      {
        "sourcePath": "lookupAndJoinTables | 'Run Summary' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorRunSummaryResultFinalTiterCedexMap | Final Titer Cedex Bio HT (g/L)",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Run Summary' | Reactor Index | 'Reactor ID Details'",
        "ldmField": 'enrichLDMTable |  idbsBioreactorRunSummaryProcessIdMap | Reactor Index | results | refProcessId',
        "ldmPath": '',
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },


      {
        "sourcePath": "lookupAndJoinTables | 'Run Summary' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorRunSummaryResultFinalTiterHplcMap | Final Titer HPLC (g/L)",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Run Summary' | Reactor Index | 'Reactor ID Details'",
        "ldmField": 'enrichLDMTable |  idbsBioreactorRunSummaryProcessIdMap | Reactor Index | results | refProcessId',
        "ldmPath": '',
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },



      {
        "sourcePath": "lookupAndJoinTables | 'Run Summary' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorRunSummaryResultSpecificProductivityCedexMap | Average Specific Productivity Cedex Bio HT (pcd)",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Run Summary' | Reactor Index | 'Reactor ID Details'",
        "ldmField": 'enrichLDMTable |  idbsBioreactorRunSummaryProcessIdMap | Reactor Index | results | refProcessId',
        "ldmPath": '',
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },


      {
        "sourcePath": "lookupAndJoinTables | 'Run Summary' | Reactor Index | 'Vessel Setup'",
        "ldmField": "insertTableToLDM | idbsBioreactorRunSummaryResultSpecificProductivityHplcMap | Average Specific Productivity HPLC (pcd)",
        "ldmPath": "results[]",
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      },
      {
        "sourcePath": "lookupAndJoinTables | 'Run Summary' | Reactor Index | 'Reactor ID Details'",
        "ldmField": 'enrichLDMTable |  idbsBioreactorRunSummaryProcessIdMap | Reactor Index | results | refProcessId',
        "ldmPath": '',
        preserve: true,
        condition: 'tableValueEqualsCondition | Sampling | c Control | c Filterc'
      }
    ]
  }
}

module.exports = IDBSBioreactorMap;
