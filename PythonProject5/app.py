"""
TACF - Teste de Avaliação do Condicionamento Físico
Aplicação web para cálculo da avaliação física baseada no documento NSCA 54-1 DEZ 2024
"""
import logging
import os
from flask import Flask, render_template, request, redirect, url_for, flash, session
from calculator import calcular_tacf

# Configuração do logging
logging.basicConfig(level=logging.DEBUG)
# Inicialização da aplicação Flask
app = Flask( __name__ )
app.secret_key = os.environ.get( "SESSION_SECRET", "tacf_secret_key_development" )
os.environ.get("SESSION_SECRET")

@app.route('/', methods=['GET', 'POST'] )
def index () :
    """
    Rota principal que exibe o formulário de entrada e processa os dados quando enviados.
    """
    if request.method == 'POST' :
        try :
            # Processamento dos dados do formulário
            genero = request.form.get( 'genero' )
            idade = int( request.form.get( 'idade' ) )
            estatura = float( request.form.get( 'estatura' ) )
            cintura = float( request.form.get( 'cintura' ) )
            flexoes = int( request.form.get( 'flexoes' ) )
            abdominais = int( request.form.get( 'abdominais' ) )

            # Processamento da distância de corrida em metros
            corrida_distancia = int( request.form.get( 'corrida' ) )

            # Verificação de dados válidos
            if idade < 16 or idade > 80 :
                flash( 'Idade deve estar entre 16 e 80 anos.', 'error' )
                return redirect( url_for( 'index' ) )

            if estatura < 140 or estatura > 220 :
                flash( 'Estatura deve estar entre 140 e 220 cm.', 'error' )
                return redirect( url_for( 'index' ) )

            if cintura < 50 or cintura > 150 :
                flash( 'Medida da cintura deve estar entre 50 e 150 cm.', 'error' )
                return redirect( url_for( 'index' ) )

            # Cálculo do TACF
            resultado = calcular_tacf(
                genero, idade, estatura, cintura, flexoes, abdominais, corrida_distancia
            )

            # Armazenamento do resultado na sessão para exibição
            session['resultado'] = resultado
            session['dados_usuario'] = {
                'genero' : genero,
                'idade' : idade,
                'estatura' : estatura,
                'cintura' : cintura,
                'flexoes' : flexoes,
                'abdominais' : abdominais,
                'corrida_distancia' : corrida_distancia
            }

            return redirect( url_for( 'resultados' ) )

        except ValueError as e :
            flash(
                f'Erro ao processar os dados: {str( e )}. Verifique se todos os campos estão preenchidos corretamente.',
                'error' )
            return redirect( url_for( 'index' ) )
        except Exception as e :
            flash( f'Ocorreu um erro inesperado: {str( e )}', 'error' )
            logging.error( f"Erro inesperado: {str( e )}" )
            return redirect( url_for( 'index' ) )

    return render_template( 'index.html' )


@app.route( '/resultados' )
def resultados () :
    """
    Rota que exibe os resultados do cálculo do TACF.
    """
    resultado = session.get( 'resultado' )
    dados_usuario = session.get( 'dados_usuario' )

    if not resultado or not dados_usuario :
        flash( 'Nenhum resultado disponível. Por favor, preencha o formulário.', 'warning' )
        return redirect( url_for( 'index' ) )

    return render_template(
        'results.html',
        resultado=resultado,
        dados=dados_usuario
    )


@app.route( '/sobre' )
def sobre () :
    """
    Rota que exibe informações sobre o TACF.
    """
    return render_template( 'index.html', mostrar_sobre=True )


@app.route( '/limpar' )
def limpar () :
    """
    Rota para limpar os dados da sessão e reiniciar o formulário.
    """
    session.pop( 'resultado', None )
    session.pop( 'dados_usuario', None )
    return redirect( url_for( 'index' ) )


# Função que converte a pontuação em uma classe de cor para melhor visualização
@app.template_filter( 'cor_pontuacao' )
def cor_pontuacao ( valor ) :
    """
    Retorna uma classe CSS baseada na pontuação.
    """
    if valor < 5 :
        return 'danger'  # Vermelho
    elif valor < 7 :
        return 'warning'  # Amarelo
    elif valor < 9 :
        return 'info'  # Azul
    else :
        return 'success'  # Verde


# Função que converte o conceito em uma classe de cor para melhor visualização
@app.template_filter( 'cor_conceito' )
def cor_conceito ( conceito ) :
    """
    Retorna uma classe CSS baseada no conceito.
    """
    if conceito.startswith( 'I' ) :
        return 'danger'  # Vermelho
    elif conceito.startswith( 'R' ) :
        return 'warning'  # Amarelo
    elif conceito.startswith( 'B' ) :
        return 'info'  # Azul
    elif conceito.startswith( 'MB' ) :
        return 'primary'  # Azul escuro
    else :
        return 'success'  # Verde
