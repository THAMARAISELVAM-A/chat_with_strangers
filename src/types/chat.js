// Type definitions for the chat app
// These are JSDoc-style type declarations

/** @typedef {Object} ChatSession
 * @property {string} id
 * @property {string} nickname
 * @property {number} createdAt
 * @property {string[]} blockedUsers
 * @property {number} lastSeen
 */

/** @typedef {Object} ChatRoom
 * @property {string} id
 * @property {string} user_a
 * @property {string} user_b
 * @property {string} status
 * @property {number} createdAt
 */

/** @typedef {Object} ChatMessage
 * @property {string} id
 * @property {string} room_id
 * @property {string} sender_session_id
 * @property {string} sender_nickname
 * @property {string} content
 * @property {string} image_url
 * @property {number} createdAt
 */

/** @typedef {Object} AppStage
 * @property {string} kind
 */

module.exports = {};