type Success = {
    success: true;
}

type Failure = {
    error: true;
};

type NewResponse = Success | Failure;

export default NewResponse;