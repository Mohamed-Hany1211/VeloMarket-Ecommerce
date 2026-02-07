import { systemRoles } from "../../utils/system-roles.js";



export const endPointsRoles = {
    ADD_PRODUCT: [systemRoles.SUPER_ADMIN],
    DELETE_PRODUCT :[systemRoles.USER]
}