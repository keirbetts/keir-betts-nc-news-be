exports.formatDates = list => {
  return list.map(article => {
    let newObj = { ...article };
    newObj.created_at = new Date(newObj.created_at);
    return newObj;
  });
};

exports.makeRefObj = list => {
  const refObj = {};
  list.forEach(article => {
    refObj[article.title] = article.article_id;
  });
  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  return comments.map(comment => {
    newCom = { ...comment };
    newCom.article_id = articleRef[newCom.belongs_to];
    delete newCom.belongs_to;
    newCom.created_at = new Date(newCom.created_at);
    newCom.author = newCom.created_by;
    delete newCom.created_by;
    return newCom;
  });
};
