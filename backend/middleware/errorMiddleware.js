const notFound=(req,res,next)=>{
    const error=new Error(`Not Found - ${req.orginalUrl}`);
    res.status(404);
    next(error)
};

const errorHandler=(err,req,res,next)=>{
    const statuscode=res.statuscode===200? 500:res.statuscode;
    res.status(statuscode)
    res.json({
        message:err.message,
        stack:process.env.NODE_ENV==="production"? null:err.stack,
    });
};

module.exports={notFound,errorHandler}