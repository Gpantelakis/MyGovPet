import React from "react";
import CIcon from "@coreui/icons-react";
import { ratingIcons } from "../modules/IconsConfig";

const SingleComment = ({ comment }) => {


  
  const Selicon=ratingIcons.find(ic => ic.value === Number(comment.rating))
  console.log(Selicon.icon)

  return (
    <div>
      <p style={{color:"green"}}>{comment.userName}</p>
      <CIcon style={{maxHeight:"20px", color:Selicon.color}} icon={Selicon.icon}></CIcon>
      <p>{comment.body}</p>
    </div>
  );
};

export default SingleComment;
