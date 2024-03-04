export default function timeSince (timestamp) {
    const currentDate = new Date();
    const pastDate = new Date(timestamp);
  
    const timeDifference = currentDate - pastDate;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    if (days > 0) {
      return `${days} ${days === 1 ? 'hari' : 'hari'} yang lalu`;
    } else if (hours > 0) {
      return `${hours} ${hours === 1 ? 'jam' : 'jam'} yang lalu`;
    } else if (minutes > 0) {
      return `${minutes} ${minutes === 1 ? 'menit' : 'menit'} yang lalu`;
    } else {
      return 'beberapa saat yang lalu';
    }
  };