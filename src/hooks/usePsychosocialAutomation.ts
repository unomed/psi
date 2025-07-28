
import { useQuery } from "@tanstack/react-query";
import { AutomationProcessingService } from "@/services/riskManagement/automation/processingService";
import { AutomationLogsService } from "@/services/riskManagement/automation/logsService";
import { AutomationStatisticsService } from "@/services/riskManagement/automation/statisticsService";

// Import the complete hook from the modular version
export { usePsychosocialAutomation } from "./usePsychosocialAutomation/index";

// Export the new collective risk automation hook
export { useCollectiveRiskAutomation } from "./usePsychosocialAutomation/useCollectiveRiskAutomation";
