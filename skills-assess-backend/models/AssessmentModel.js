const db = require('../config/db');

class Assessment {
  static async createAssessment(title, description) {
    const sql = 'INSERT INTO assessments (title, description) VALUES (?, ?)';
    const [result] = await db.execute(sql, [title, description]);
    return result.insertId;
  }

  static async getAllAssessments() {
    const sql = 'SELECT * FROM assessments';
    const [rows] = await db.execute(sql);
    return rows;
  }

  static async getAssessmentById(id) {
    const sql = 'SELECT * FROM assessments WHERE id = ?';
    const [rows] = await db.execute(sql, [id]);
    return rows[0];
  }

  static async addQuestion(assessment_id, question_text, correct_answer, options) {
    const sql = 'INSERT INTO questions (assessment_id, question_text, correct_answer, options) VALUES (?, ?, ?, ?)';
    const [result] = await db.execute(sql, [assessment_id, question_text, correct_answer, JSON.stringify(options)]);
    return result.insertId;
  }

  static async getQuestionsByAssessmentId(assessment_id) {
    const sql = 'SELECT * FROM questions WHERE assessment_id = ?';
    const [rows] = await db.execute(sql, [assessment_id]);
    return rows;
  }
}

module.exports = Assessment;
