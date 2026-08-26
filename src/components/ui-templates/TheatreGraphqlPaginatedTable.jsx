import React from "react";
import GraphqlPaginatedTable from "./GraphqlPaginatedTable";

/**
 * Theatre Time Utilization response structure after RTK transformResponse:
 * {
 *   status: boolean,
 *   code: number,
 *   message: string,
 *   data: { items: [...], totalCount: number }
 * }
 *
 * Status codes:
 *   8000 = SUCCESS
 *   8001 = INVALID_REQUEST
 *   8002 = NO_RECORD_FOUND
 *   8003 = UNAUTHORIZED
 *   8004 = DUPLICATE
 *   8005 = FAILURE
 *   8006 = DATA_IN_USE
 *   8007 = BAD_REQUEST
 *   8008 = METHOD_NOT_ALLOWED
 *   8009 = RESTRICTED_ACCESS
 *   8010 = LIMIT_REACHED
 *   8011 = NULL_ARGUMENT
 *   8012 = NO_DATA_CHANGED
 *   8013 = FILE_NOT_EXIST
 *   8016 = NO_PARENT_RECORD
 *   8021 = PROCESS_ALREADY_COMPLETED
 *   8022 = IS_NOT_FOR_SUBMISSION
 *   8023 = PROCESS_NOT_DEFINED
 *   8024 = NO_APPROVAL_ACTION
 *   8025 = NO_FINANCIAL_YEAR
 *   8026 = SUBMISSION_STAGE_NOT_DEFINED
 *   8027 = RECEIVING_STAGE_NOT_DEFINED
 *   8028 = ALREADY_SUBMITTED
 *   8029 = RECORD_IS_DELETED
 *   8030 = RECORD_IS_DROPPED
 *   8031 = RECORD_IS_IN_PROGRESS
 *   8035 = RECORD_IS_IN_APPROVAL_PROCESS
 *   8037 = ALREADY_APPROVED
 *   8038 = NOT_INITIALISED
 *   8040 = PARTIAL_SUCCESS
 *   8042 = ALREADY_ASSIGNED
 *   8044 = DUPLICATE_ASSIGNMENT
 */
const theatreResponseExtractor = (response) => {
    // After RTK transformGqlResponse, the response is already the operation result envelope.
    // e.g. { status: true, code: 8000, message: "Success", data: { items: [...], totalCount: 10 } }

    if (!response) {
        return { items: [], totalCount: 0 };
    }

    // Extract the envelope fields
    const { status, code, message, data } = response;

    // Determine status type for the status bar
    let statusType = "info";
    if (code === 8000 || code === 8040) {
        statusType = "success";
    } else if (code === 8003 || code === 8005 || code === 8007 || code === 8009 || code === 8011 || code === 8013 || code === 8016 || code === 8023 || code === 8024 || code === 8025 || code === 8026 || code === 8027) {
        statusType = "error";
    } else if (code === 8002 || code === 8004 || code === 8006 || code === 8010 || code === 8022 || code === 8028 || code === 8030 || code === 8038 || code === 8044) {
        statusType = "warning";
    }

    // Extract items from the nested data object
    if (data && typeof data === 'object' && ('items' in data || 'totalCount' in data)) {
        return {
            items: data.items || [],
            totalCount: data.totalCount ?? (data.items?.length || 0),
            statusCode: code,
            statusMessage: message,
            statusType,
        };
    }

    if (Array.isArray(data)) {
        return {
            items: data,
            totalCount: data.length,
            statusCode: code,
            statusMessage: message,
            statusType,
        };
    }

    // No data payload – probably non-SUCCESS code
    return {
        items: [],
        totalCount: 0,
        statusCode: code,
        statusMessage: message,
        statusType,
    };
};

const TheatreGraphqlPaginatedTable = (props) => (
    <GraphqlPaginatedTable
        responseExtractor={theatreResponseExtractor}
        loadingMessage="Fetching theatre records..."
        errorMessage="Unable to fetch theatre records. Please try again."
        {...props}
    />
);

TheatreGraphqlPaginatedTable.displayName = "TheatreGraphqlPaginatedTable";

export default TheatreGraphqlPaginatedTable;