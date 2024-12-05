module.exports = {
  
  // Format a date to MM/DD/YYYY
  format_date: (date) => {
    const d = new Date(date);
    const formattedDate = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    return formattedDate;
  },

  // Format a timestamp to display in readable format
  format_time: (date) => {
    return new Date(date).toLocaleTimeString();
  },

  // Format date and time together
  format_datetime: (date) => {
    const d = new Date(date);
    return `${d.toLocaleDateString()} at ${d.toLocaleTimeString()}`;
  },

  // Truncate long text with ellipsis
  truncate: (text, length = 100) => {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  },

  // Check if two values are equal
  eq: (a, b) => {
    return a === b;
  },

  // Pluralize a word based on count
  pluralize: (word, count) => {
    return count === 1 ? word : `${word}s`;
  },

  // Format a number with commas
  format_number: (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  // Calculate time ago (e.g., "2 hours ago")
  time_ago: (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return Math.floor(seconds) + ' seconds ago';
  },

  // Get word count from text
  word_count: (text) => {
    return text.split(/\s+/).length;
  }
};