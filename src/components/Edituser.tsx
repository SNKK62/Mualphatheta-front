import axios from './axios';
import styled from 'styled-components';
import { TextField } from '@material-ui/core';
import { LoadingButton } from '@mui/lab';
import { useState, useRef,useEffect, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { url } from './url';
import Loading from './Loading';
import dataFetch from './DataFetch';
import newuserimage from '../newuserimage.png';
import Wrapper from './Wrapper';


const Message = styled.div`
    font-size: 30px;
    margin-top: 30px;
`
const Textinput = styled(TextField)`
    width: 100%;
`
const Textwrapper = styled.div`
    width: 80%;
    margin: 40px auto 40px auto;
`

const Button = styled(LoadingButton)`
    width: 50;
`
const Buttonwrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 30px auto;
`
const Image = styled.img`
    width: 70px;
    height: 70px;
    border-radius: 50%;
    object-fit: cover;
    margin: 15px 0 15px 0;
`
const Fileinput = styled.input`
    display: none;
`
const Filebutton = styled.label`
    width: 70px;
    height: 70px;
    border-radius: 50%;
`
const Filewrapper = styled.div`
    width: 100%;
    height: 90px;
    display: flex;
    justify-content: center;
    align-items: center;
`
const Defaultdiv = styled.div`
    height: 20px;
    width: 250px;
    margin: 30px auto 20px auto;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px black solid;
    padding: 5px 0 5px 0;
`
const initialState = {
    isLoading: true,
    isError: '',
    post: {}
};

function Edituser() {
    const [loading, setLoading] = useState(false);
    const [ifdefault, setIfdefault] = useState('nondefault');
    const { id } = useParams();
    const user_url = url + '/users/' +  id ;
    const [dataState, dispatch] = useReducer(dataFetch, initialState);
    const Nameref = useRef(null);
    const Passref = useRef(null);
    const Passconfref = useRef(null);
    const Imageref = useRef(null);
    const [imgurl, setImgurl] = useState('');
    const navigate = useNavigate();
    
    useEffect(() => {
        axios.get(user_url).then(resp => {
            setImgurl(resp.data.user.image_url);
            dispatch({ type: 'success', payload: resp.data });
        }).catch(e => {
            console.log(e);
        })
    }, [])
    const imghandle = (e:any) => {
        if (e.target.files[0]) {
            setIfdefault('nondefault');
            setImgurl(URL.createObjectURL(e.target.files[0]));
        }
    };
    const defaulthandle = () => {
        setIfdefault('default');
        setImgurl(newuserimage);
    }
    const handle = () => {
        setLoading(true);
        const name: any = Nameref.current;
        const pass: any = Passref.current;
        const passconf: any = Passconfref.current;
        const image: any = Imageref.current;
        const data = new FormData();
        data.append('user[name]', name.childNodes[1].childNodes[0].value)
        data.append('user[password]', pass.childNodes[1].childNodes[0].value)
        data.append('user[password_confirmation]', passconf.childNodes[1].childNodes[0].value)
        console.log(!image.files[0])
        if (ifdefault == 'default') {
            data.append('user[image]', 'default');  
        } else if (!image.files[0]) {
            data.append('user[image]', 'nondefault');
        } else {
            data.append('user[image]', image.files[0]);
        }
        axios.patch(user_url, data).then(resp => {
            setLoading(false);
            const new_id = resp.data.user.id;
            navigate('/users/'+new_id)
        }).catch(e => {
            console.log(e.response.error);
            setLoading(false);
        })

    }
    return (
        <>
            <Wrapper>
                {dataState.isLoading ? 
                    <Loading></Loading> :
                <>
                    <Message>
                        Edit
                    </Message>
                    <Filewrapper>
                        <Filebutton htmlFor='file-input'>
                            <Image src={imgurl} />
                        </Filebutton>
                        <Fileinput id='file-input' ref={Imageref} type='file' accept='image/*' onChange={e => imghandle(e)} />
                    </Filewrapper>
                    <Defaultdiv onClick={defaulthandle} >デフォルトの画像を使用する</Defaultdiv>
                    <Textwrapper>
                        <Textinput id='name' ref={Nameref} error={false} label="Name" variant="standard"/>
                    </Textwrapper>
                    <Textwrapper>
                        <Textinput id='password' type='password' ref={Passref} error={false} label="Password" variant="standard"  />
                    </Textwrapper>
                    <Textwrapper>
                        <Textinput id='password_confirmation' type='password' ref={Passconfref} error={false} label="Password_Confirmation" variant="standard"  />
                    </Textwrapper>    
                    <Buttonwrapper>
                        <Button loading={loading} onClick={handle} variant="outlined" >変更</Button>
                    </Buttonwrapper>
                </>
            }
                </Wrapper>
                
                
                </>
                )
}

export default Edituser